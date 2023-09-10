"use strict";

import { Express, Request, Response, NextFunction } from "express";
import { Session } from "express-session";
import { rateLimit } from "express-rate-limit";
import isEmail from "validator/lib/isEmail";
import {
  PENDING,
  ONGOING,
  DONE,
  LOW_PRIORITY,
  MEDIUM_PRIORITY,
  HIGH_PRIORITY,
  URGENT_PRIORITY,
  USERNAME_LIMIT,
  PASSWORD_LIMIT,
  TITLE_LIMIT,
  DESCRIPTION_LIMIT,
  CATEGORY_LIMIT,
} from "../src/constants";

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
const saltRounds = 10;

import crypto from "crypto";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    maxLength: USERNAME_LIMIT,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  email: { type: String, required: true },
  accepted_terms_of_service_at: { type: Date, required: true },
  tasks: [
    {
      category: { type: String, maxLength: CATEGORY_LIMIT, required: true },
      status: {
        type: String,
        enum: {
          values: [PENDING, ONGOING, DONE],
          message: `Status must be ${PENDING} ,${ONGOING} or ${DONE}`,
        },
        default: PENDING,
      },
      task_title: { type: String, maxLength: TITLE_LIMIT, required: true },
      task_text: { type: String, maxLength: DESCRIPTION_LIMIT },
      priority: {
        type: String,
        enum: {
          values: [
            LOW_PRIORITY,
            MEDIUM_PRIORITY,
            HIGH_PRIORITY,
            URGENT_PRIORITY,
          ],
          message: `Priority must be ${LOW_PRIORITY} ,${MEDIUM_PRIORITY}, ${HIGH_PRIORITY} or ${URGENT_PRIORITY}`,
        },
      },
      created_on: Date,
      accomplished_on: Date,
      due_date: Date,
    },
  ],
});

const User = mongoose.model("User", userSchema);

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env["EMAIL"],
    pass: process.env["EMAIL_PASSWORD"],
  },
});

// COMMON ERRORS:
const missingFieldError = (field: string, res: Response) => {
  res.status(400).json({ error: `Required ${field} missing` });
};

const notFoundError = (thing: string, res: Response) => {
  res.status(404).json({ error: `${thing} not found` });
};

const conflictingPasswordError = (res: Response) => {
  res.status(400).json({ error: "Confirmation password does not match" });
};

const longPasswordError = (res: Response) => {
  res.status(400).json({ error: "Password is too long" });
};

const acceptTermsError = (res: Response) => {
  res.status(403).json({ error: "Must accept the terms of service" });
};

const usernameExistsError = (username: string, res: Response) => {
  res
    .status(409)
    .json({ error: `<p>Username <b>${username}</b> already exists</p>` });
};

const invalidEmailFormatError = (res: Response) => {
  res.status(400).json({ error: "Invalid e-mail format" });
};

const handle500Error = (error: any, errorMessage: string, res: Response) => {
  console.log(`${errorMessage}${error ? ": " + error : ""}`);
  res.status(500).json({ error: errorMessage });
};

// FUNCTIONS:

// get index of item
const getIndex = (list: Array<any>, key: string, value: any) => {
  let index = -1;
  if (list && key && value) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][key] == value) {
        index = i;
        break;
      }
    }
  }
  return index;
};

// destroy session
const destroySession = (session: Session, res: Response) => {
  session.destroy((err: Error) => {
    if (err) {
      handle500Error(
        err,
        "An internal error occurred while destroying the session",
        res
      );
      return;
    } else {
      console.log("Session successfully destroyed");
    }
  });
};

// get the html file for an email template
const getEmailTemplate = (filename: string) => {
  const emailTemplatePath = path.join(
    __dirname,
    `../email-templates/${filename}`
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  return emailTemplate;
};

// get the email address partially hidden
const partiallyHiddenEmail = (email: string) => {
  const parts = email.split("@");
  const username = parts[0];
  const domain = parts[1];
  const hiddenEmail = username.charAt(0) + "*****" + "@" + domain;
  return hiddenEmail;
};

// MIDDLEWARE:

// check if there is connection to users databases
const handleDBConnection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.connection || !mongoose.connection.readyState) {
    mongoose
      .connect(process.env.MONGO_URI!)
      .then(() => {
        console.log("Successfully connected to users database via Mongoose");
        next();
      })
      .catch((err) => {
        console.log("Error connecting to users database via Mongoose: ", err);
        handle500Error(
          null,
          "Sorry! We could not establish a connection to the users database. Please try again later.",
          res
        );
      });
  } else {
    next();
  }
};

// autheticate if the user session is active
const authenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized request. Please log in" });
  }
};

// get user id
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.session.user || null;
  const username = req.body.username || null;
  let user;
  if (!username && !id) {
    missingFieldError("username or user id", res);
  } else {
    if (id) {
      user = await User.findById(id);
    } else if (username) {
      user = await User.findOne({ username: username });
    }
    if (!user) {
      notFoundError(`User ${username}`, res);
    } else {
      req.user = user;
      next();
    }
  }
};

// REQUEST LIMITERS:

const attemptPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: {
    error:
      "Too many attempts to input password. Please try again after 30 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API ROUTES:

export default function (app: Express) {
  // ~~~ HANDLE USER SESSION ~~~

  // send request to recover password via e-mail
  app
    .route("/api/recover-password")
    .post(getUser, async (req: Request, res: Response) => {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expirationMins = 10;
      req.session.resetToken = resetToken;
      req.session.cookie.maxAge = 1000 * 60 * expirationMins; // 10 minutes

      const email = req.user.email;

      const emailTemplate = getEmailTemplate("reset-password-email.html");
      const resetLink = `${req.protocol}://${req.get(
        "host"
      )}/reset-password?token=${resetToken}&_id=${req.user.id}`;
      const htmlContent = emailTemplate
        .replace("{{resetLink}}", resetLink)
        .replace("{{expirationTime}}", `${expirationMins} minutes`)
        .replace("{{username}}", req.user.username);

      try {
        const mailOptions = {
          from: process.env["EMAIL"],
          to: email,
          subject: "Password Recovery",
          html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
          result: `Instructions for recovering your password were successfully sent to your email address ${partiallyHiddenEmail(
            email
          )}.`,
        });
      } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ error: `Failed to send email to ${email}.` });
      }
    });

  // reset-password route
  app.route("/api/reset-password").get(async (req, res) => {
    const token = req.query.token as string;
    const id = req.query._id as string;
    console.log(id);
    if (token === req.session.resetToken) {
      const user = await User.findById(id);
      if (!user) {
        notFoundError(`User with id ${id}`, res);
      } else {
        delete req.session.resetToken;
        req.session.user = id;
        console.log("Session restored");
        res.status(200).send({ result: "Session restored", user: user });
      }
    } else {
      res.status(400).json({ error: "Invalid or expired token" });
    }
  });

  // get user from session:
  app
    .route("/api/user-from-session/")
    .get(handleDBConnection, async (req: Request, res: Response) => {
      if (!req.session.user) {
        res.status(204).json({ result: "No logged-in user" });
      } else {
        const id = req.session.user;
        const user = await User.findById(req.session.user);
        if (!user) {
          notFoundError(`User with id ${id}`, res);
        } else {
          res.json({ user: user });
        }
      }
    });

  // sign up a new user
  app.route("/api/sign-up").post(async (req: Request, res: Response) => {
    if (!req.body.username) {
      missingFieldError("username", res);
    } else if (!req.body.password) {
      missingFieldError("password", res);
    } else if (!req.body.email) {
      missingFieldError("e-mail", res);
    } else if (!isEmail(req.body.email)) {
      invalidEmailFormatError(res);
    } else if (!req.body.accepted_terms) {
      acceptTermsError(res);
    } else if (!req.body.confirm_password) {
      missingFieldError("confirm password", res);
    } else if (req.body.password.length > PASSWORD_LIMIT) {
      longPasswordError(res);
    } else {
      const username = req.body.username;
      const user = await User.findOne({
        username: username,
      });
      if (user) {
        usernameExistsError(username, res);
      } else if (req.body.password != req.body.confirm_password) {
        conflictingPasswordError(res);
      } else {
        const emailTemplate = getEmailTemplate("welcome-email.html");
        const htmlContent = emailTemplate.replace("{{username}}", username);
        const email = req.body.email;
        try {
          const mailOptions = {
            from: process.env["EMAIL"],
            to: email,
            subject: "Welcome to Task Tracker!",
            html: htmlContent,
          };
          await transporter.sendMail(mailOptions);
          const hashed = bcrypt.hashSync(req.body.password, saltRounds);
          const date = new Date();
          let newUser = new User({
            username: username,
            password: hashed,
            accepted_terms_of_service_at: date,
            email: email,
            tasks: [],
          });
          try {
            await User.create(newUser);
            req.session.user = `${newUser._id}`;
            res.json({
              result: `<p>Congratulations <b>${username}</b>!<br/>Your account has been successfully created.<br/>If you haven't received a confirmation email, please check your spam folder or verify your email address in your Profile Settings.</p>`,
              user: newUser,
            });
          } catch (error) {
            handle500Error(
              error,
              "An internal error occurred while creating the user account",
              res
            );
          }
        } catch (error) {
          console.error("Error sending email: ", error);
          res.status(500).json({ error: `Failed to send email to ${email}.` });
        }
      }
    }
  });

  // log in a user
  app
    .route("/api/log-in")
    .post(
      getUser,
      attemptPasswordLimiter,
      async (req: Request, res: Response) => {
        if (!req.body.password) {
          missingFieldError("password", res);
        } else {
          const user = req.user;
          const username = req.body.username;
          const password = req.body.password;
          const validPassword = bcrypt.compareSync(password, user.password);
          if (!validPassword) {
            res.status(401).json({ error: "Invalid password" });
          } else {
            try {
              await user.save();
              req.session.user = `${user._id}`;
              res.json({
                result: `${username} logged in`,
                user: user,
              });
            } catch (error) {
              handle500Error(
                error,
                "An internal error occurred while logging in",
                res
              );
            }
          }
        }
      }
    );

  // log out a user
  app
    .route("/api/log-out")
    .post(authenticateSession, async (req: Request, res: Response) => {
      destroySession(req.session, res);
      res.json({ result: "Succesfully logged out" });
    });

  // update user info
  app
    .route("/api/update-info")
    .put(authenticateSession, getUser, async (req: Request, res: Response) => {
      let user = req.user;
      const newUsername = req.body.new_username || "";
      const newEmail = req.body.new_email || "";
      const newPassword = req.body.new_password || "";
      const confirmPassword = req.body.confirm_password || "";
      if (!newUsername && !newPassword && !newEmail) {
        missingFieldError("username, password or email", res);
      } else if (req.body.new_password.length > PASSWORD_LIMIT) {
        longPasswordError(res);
      } else if (newPassword && newPassword != confirmPassword) {
        conflictingPasswordError(res);
      } else if (newEmail && !isEmail(newEmail)) {
        invalidEmailFormatError(res);
      } else {
        let fieldUpdated = false;
        if (newUsername != "") {
          const usernameExists = await User.findOne({
            username: newUsername,
          });
          if (usernameExists) {
            usernameExistsError(newUsername, res);
            return;
          } else {
            user.username = newUsername;
            fieldUpdated = true;
          }
        }
        let hashed = "";
        if (newPassword != "") {
          hashed = bcrypt.hashSync(newPassword, saltRounds);
          user.password = hashed;
          fieldUpdated = true;
        }
        if (newEmail != "") {
          user.email = newEmail;
          fieldUpdated = true;
        }
        if (fieldUpdated) {
          try {
            await user.save();
            res.json({
              result: "User info successfully updated",
              new_username: newUsername,
              new_password: hashed,
            });
          } catch (error) {
            handle500Error(
              error,
              "An internal error occurred while updating the info",
              res
            );
          }
        }
      }
    });

  // remove a user
  app
    .route("/api/delete-account")
    .delete(
      authenticateSession,
      getUser,
      async (req: Request, res: Response) => {
        let user = req.user;
        let username = user.username;
        try {
          await User.deleteOne({ username: username });
          destroySession(req.session, res);
          res.json({
            result: `<p>User account for <b>${username}</b> successfully deleted</p>`,
          });
        } catch (error) {
          const errorMessage = "An error occurred while deleting the user";
          console.log(errorMessage + ": ", error);
          res.status(500).json({ error: errorMessage });
        }
      }
    );

  // ~~~ HANDLE TASKS ~~~

  // add a new task:
  app
    .route("/api/new-task")
    .post(authenticateSession, getUser, async (req: Request, res: Response) => {
      let user = req.user;
      if (!req.body.task_title) {
        missingFieldError("title", res);
      } else if (!req.body.category) {
        missingFieldError("category", res);
      } else {
        const title = req.body.task_title;
        const category = req.body.category;
        const priority = req.body.priority;
        const text = req.body.task_text || "";
        const due_date = req.body.due_date ? new Date(req.body.due_date) : null;
        const date = new Date();
        let newTask = {
          task_title: title,
          task_text: text,
          priority: priority,
          category: category,
          status: PENDING,
          created_on: date,
          accomplished_on: null,
          due_date: due_date,
        };
        user.tasks.unshift(newTask);
        try {
          user = await user.save();
          res.json({ result: "Task successfully created", tasks: user.tasks });
        } catch (error) {
          handle500Error(
            error,
            "An internal error occurred while creating the task",
            res
          );
        }
      }
    });

  // update a task
  app
    .route("/api/update-task")
    .put(authenticateSession, getUser, async (req: Request, res: Response) => {
      let user = req.user;
      if (!req.body._id) {
        missingFieldError("id", res);
      } else {
        const _id = req.body._id;
        let task_index = getIndex(user.tasks, "_id", _id);
        if (task_index == -1) {
          notFoundError("Task", res);
        }
        let noFields = true;
        for (let prop in req.body) {
          if (
            (prop != "_id" && req.body[prop]) ||
            (prop == "task_text" && req.body[prop] === "") ||
            (prop == "due_date" && req.body[prop] === "")
          ) {
            noFields = false;
          }
        }
        if (noFields) {
          console.log(req.body.task_text);
          missingFieldError("fields", res);
        } else {
          const validKeys = [
            "_id",
            "category",
            "status",
            "priority",
            "task_title",
            "task_text",
            "due_date",
            "accomplished_on",
          ];
          for (let prop in req.body) {
            if (!validKeys.includes(prop)) {
              res.status(400).json({
                error: `Invalid fields found. Updatable fields are ${validKeys
                  .map((key) => `"${key}"`)
                  .join(", ")}`,
              });
              return;
            } else if (prop === "accomplished_on" && req.body[prop] === "") {
              user.tasks[task_index][prop] = null;
            } else if (req.body[prop] || req.body[prop] === "") {
              user.tasks[task_index][prop] = req.body[prop];
            }
          }
          try {
            user = await user.save();
            res.json({
              result: "Task successfully updated",
              tasks: user.tasks,
            });
          } catch {
            res
              .status(500)
              .json({ error: "An error occurred while updating the task" });
          }
        }
      }
    });

  // delete a task
  app
    .route("/api/delete-task")
    .delete(
      authenticateSession,
      getUser,
      async (req: Request, res: Response) => {
        let user = req.user;
        if (!req.body._id) {
          missingFieldError("id", res);
        } else {
          const _id = req.body._id;
          const task_index = getIndex(user.tasks, "_id", _id);
          user.tasks.splice(task_index, 1);
          try {
            user = await user.save();
            res.json({
              result: "Task successfully deleted",
              tasks: user.tasks,
            });
          } catch {
            res
              .status(500)
              .json({ error: "An error occurred while deleting the task" });
          }
        }
      }
    );
}
