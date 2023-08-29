"use strict";

import { Express, Request, Response, NextFunction } from "express";
import { Session } from "express-session";
import { rateLimit } from "express-rate-limit";
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
} from "../constants";

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
const saltRounds = 10;

import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() =>
    console.log("Successfully connected to users database via Mongoose")
  )
  .catch((err) => {
    console.log("Error connecting to users database via Mongoose: ", err);
  });

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    maxLength: USERNAME_LIMIT,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
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

// COMMON ERRORS:
const missingFieldError = (field: string, res: Response) => {
  res.status(400).json({ error: `Required ${field} missing` });
};

const notFoundError = (thing: string, res: Response) => {
  res.status(400).json({ error: `${thing} not found` });
};

const conflictingPasswordError = (res: Response) => {
  res.status(400).json({ error: "Confirmation password does not match" });
};

const longPasswordError = (res: Response) => {
  res.status(400).json({ error: "Password is too long" });
};

const usernameExistsError = (username: string, res: Response) => {
  res.status(409).json({ error: `Username '${username}' already exists` });
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
  session.destroy((err: any) => {
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

// MIDDLEWARE:

// check if there is connection to sessions and users databases
/*const checkDBConnection = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    handle500Error(null, "Unable to connect to sessions database", res);
  } else if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    handle500Error(null, "Unable to connect to users database", res);
  }
  next();
};*/

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

// get user id from session
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.session.user || null;
  const username = req.body.username || null;
  let user;
  if (!username && !id) {
    missingFieldError("username or id", res);
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

  // get user from session:
  app
    .route("/api/user-from-session/")
    .get(async (req: Request, res: Response) => {
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

  // add a new user
  app.route("/api/sign-up").post(async (req: Request, res: Response) => {
    if (!req.body.username) {
      missingFieldError("username", res);
    } else if (!req.body.password) {
      missingFieldError("password", res);
    } else if (!req.body.confirm_password) {
      missingFieldError("confirm password", res);
    } else if (
      req.body.password.length > PASSWORD_LIMIT ||
      req.body.confirm_password.length > PASSWORD_LIMIT
    ) {
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
        const hashed = bcrypt.hashSync(req.body.password, saltRounds);
        let newUser = new User({
          username: username,
          password: hashed,
          tasks: [],
        });
        try {
          await User.create(newUser);
          req.session.user = `${newUser._id}`;
          res.json({
            result: `New user account for ${username} successfully created`,
            user: newUser,
          });
        } catch (error) {
          handle500Error(
            error,
            "An internal error occurred while creating the user account",
            res
          );
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
      const newPassword = req.body.new_password || "";
      const confirmPassword = req.body.confirm_password || "";
      if (!newUsername && !newPassword) {
        missingFieldError("fields", res);
      } else if (newPassword && newPassword != confirmPassword) {
        conflictingPasswordError(res);
      } else if (
        req.body.password.length > PASSWORD_LIMIT ||
        req.body.confirm_password.length > PASSWORD_LIMIT
      ) {
        longPasswordError(res);
      } else {
        let fieldUpdated = false;
        if (newUsername != "") {
          const usernameExists = await User.findOne({ username: newUsername });
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
            result: `User account for ${username} successfully deleted`,
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
