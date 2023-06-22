"use strict";

import { Express, Request, Response, NextFunction } from "express";
import { Session } from "express-session";
import { PENDING } from "../constants";

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
const saltRounds = 10;

import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Successfully connected to 'task-tracker' database"))
  .catch((err) =>
    console.log("Error connecting to 'task-tracker' database: ", err)
  );

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logged_in: { type: Boolean, default: true },
  tasks: [
    {
      category: { type: String, required: true },
      status: { type: String, default: PENDING },
      task_title: { type: String, required: true },
      task_text: String,
      created_on: Date,
      updated_on: Date,
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

const usernameExistsError = (username: string, res: Response) => {
  res.status(409).json({ error: `Username '${username}' already exists` });
};

// FUNCTIONS AND MIDDLEWARE:

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

// destroy session function
const destroySession = (session: Session, res: Response) => {
  session.destroy((err: any) => {
    if (err) {
      res.status(500).json({
        error: "An error occurred while destroying the session",
      });
    } else {
      console.log("Session successfully destroyed");
    }
  });
};

// get user middleware
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.username) {
    missingFieldError("username", res);
  } else {
    const username = req.body.username;
    const user = await User.findOne({ username: username });
    if (!user) {
      notFoundError(`User ${username}`, res);
    } else {
      req.user = user;
      next();
    }
  }
};

// session authentication middleware
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

// API ROUTES:
export default function (app: Express) {
  // HANDLE USER SESSION:

  // get user from session:
  app
    .route("/api/user-from-session/")
    .get(authenticateSession, async (req: Request, res: Response) => {
      const id = req.session.user;
      const user = await User.findById(req.session.user);
      if (!user) {
        notFoundError(`User with id ${id}`, res);
      } else {
        res.json({ user: user });
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
          res.status(500).json({
            error: "An error occurred while creating the user account." + error,
          });
        }
      }
    }
  });

  // log in a user
  app
    .route("/api/log-in")
    .post(getUser, async (req: Request, res: Response) => {
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
          user.logged_in = true;
          try {
            await user.save();
            req.session.user = `${user._id}`;
            res.json({
              result: `${username} logged in`,
              user: user,
            });
          } catch {
            res.status(500).json({
              error: "An error occurred while logging in the user",
            });
          }
        }
      }
    });

  // log out a user
  app
    .route("/api/log-out")
    .post(getUser, authenticateSession, async (req: Request, res: Response) => {
      let user = req.user;
      user.logged_in = false;
      try {
        await user.save();
        destroySession(req.session, res);
        res.json({ result: `${user.username} logged out` });
      } catch {
        res.status(500).json({
          error: "An error occurred while logging out the user",
        });
      }
    });

  // update user info
  app
    .route("/api/update-info")
    .put(getUser, authenticateSession, async (req: Request, res: Response) => {
      let user = req.user;
      const newUsername = req.body.new_username || "";
      const newPassword = req.body.new_password || "";
      const confirmPassword = req.body.confirm_password || "";
      if (!newUsername && !newPassword) {
        missingFieldError("fields", res);
      } else if (newPassword && newPassword != confirmPassword) {
        conflictingPasswordError(res);
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
          } catch {
            res.status(500).json({
              error: "An error occurred while updating the info",
            });
          }
        }
      }
    });

  // remove a user
  app
    .route("/api/delete-account")
    .delete(
      getUser,
      authenticateSession,
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
          res
            .status(500)
            .json({ error: "An error occurred while deleting the user" });
        }
      }
    );
}

/*

export default function (app: Express) {
  

  // HANDLE USERS:

  app
    .route("/api/:username/")

    // get all of a user's info
    .get(getUser, (req: Request, res: Response) => {
      res.json({ result: req.user });
    });

  // HANDLE TASKS:

  // get a user's tasks with optional filtering
  app
    .route("/api/:username/tasks/")
    .get(getUser, (req: Request, res: Response) => {
      const user = req.user;
      if (JSON.stringify(req.query) == "{}") {
        // if no query, return all tasks
        res.json(user.tasks);
      } else {
        // return tasks matching the query
        const keys = [
          "category",
          "status",
          "task_title",
          "task_text",
          "created_on",
          "updated_on",
          "due_date",
          "_id",
        ];
        let validKey = true;
        let errorKey;
        // check if key is valid
        for (let prop in req.query) {
          if (!keys.includes(prop)) {
            validKey = false;
            errorKey = prop;
          }
        }
        if (!validKey) {
          // error: queried with an invalid key
          res.status(400).json({ error: `"${errorKey}" is an invalid key` });
        } else {
          // if key exists
          let filteredTasks: any[] = [];
          user.tasks.map((task: any) => {
            let passesTest = true;
            for (let prop of Object.keys(req.query)) {
              // queried value coincides with task
              if (req.query[prop] && task[prop] != req.query[prop]) {
                passesTest = false;
              }
            }
            if (passesTest) filteredTasks.push(task);
          });
          if (filteredTasks.length === 0) {
            notFoundError("Task", res);
          } else {
            res.json({ result: filteredTasks });
          }
        }
      }
    })

    // create a new task
    .post(getUser, async (req: Request, res: Response) => {
      let user = req.user;
      if (!req.body.task_title) {
        missingFieldError("title", res);
      } else if (!req.body.category) {
        missingFieldError("category", res);
      } else {
        const task_title = req.body.task_title;
        const category = req.body.category;
        const task_text = req.body.task_text || "";
        const due_date = req.body.due_date || null;
        const date = new Date();
        let newTask = {
          category: category,
          status: PENDING,
          task_title: task_title,
          task_text: task_text,
          created_on: date,
          updated_on: date,
          due_date: due_date,
        };
        user.tasks = user.tasks.unshift(newTask);
        try {
          user = await user.save();
          res.json({ result: "Task successfully created." });
        } catch {
          res
            .status(500)
            .json({ error: "An error occurred while creating the task" });
        }
      }
    })

    // update a task
    .put(getUser, async (req: Request, res: Response) => {
      let user = req.user;
      if (!req.body._id) {
        missingFieldError("id", res);
      } else {
        const _id = req.body._id;
        let task_index = getIndex(user.tasks, "_id", _id);
        if (task_index == -1) {
          notFoundError(`Task`, res);
        }
        let noFields = true;
        for (let prop in req.body) {
          if (prop != "_id" && req.body[prop]) {
            noFields = false;
          }
        }
        if (noFields) {
          missingFieldError("fields", res);
        } else {
          const validKeys = [
            "category",
            "status",
            "task_title",
            "task_text",
            "due_date",
          ];
          for (let prop in req.body) {
            if (!validKeys.includes(prop)) {
              res.status(400).json({
                error: `Invalid fields found. Updatable fields are ${validKeys
                  .map((key) => `"${key}"`)
                  .join(", ")}`,
              });
            } else if (req.body[prop]) {
              user.task[task_index][prop] = req.body[prop];
            }
          }
          user.tasks[task_index].updated_on = new Date();
          try {
            user = await user.save();
            res.json({ result: "Task successfully updated" });
          } catch {
            res
              .status(500)
              .json({ error: "An error occurred while updating the task" });
          }
        }
      }
    })

    // delete a task
    .delete(getUser, async (req: Request, res: Response) => {
      let user = req.user;
      if (!req.body._id) {
        missingFieldError("id", res);
      } else {
        const _id = req.body._id;
        const task_index = getIndex(user.tasks, "_id", _id);
        user.tasks.splice(task_index, 1);
        try {
          user = await user.save();
          res.json({ result: "Task successfully deleted" });
        } catch {
          res
            .status(500)
            .json({ error: "An error occurred while deleting the task" });
        }
      }
    });
}
*/
