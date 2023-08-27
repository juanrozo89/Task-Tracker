import express from "express";
//import { Request, Response, NextFunction } from "express";
export const app = express();

import dotenv from "dotenv";
dotenv.config();

import apiRoutes from "./api.ts";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";

import { REQ_TIMEOUT_SERVER } from "../constants";

declare module "express-session" {
  export interface SessionData {
    user: string;
  }
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));
app.use(cookieParser());
app.use(helmet());

import { query, body } from "express-validator";
app.use((req, res, next) => {
  body("*").escape()(req, res, () => {});
  query("*").escape()(req, res, () => {});
  next();
});

// Handle database connection errors
/*app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});*/

import MongoDBSession from "connect-mongodb-session";
const MongoDBStore = MongoDBSession(session);
const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI_SESSIONS!,
    //uri: "bad",
    collection: "sessions",
  },
  (error) => {
    if (error) {
      console.log(
        "Could not connect to sessions database via MongoDBStore: ",
        error
      );
    }
  }
);
store.on("connected", () => {
  console.log("Succesfully connected to sessions database via MongoDBStore");
});

const oneMonth = 1000 * 60 * 60 * 24 * 7 * 30;
app.use(
  session({
    secret: process.env.SESSIONS_KEY!,
    saveUninitialized: true,
    store: store,
    unset: "destroy",
    cookie: { maxAge: oneMonth },
    resave: false,
  })
);

/*app.use((req, res, next) => {
  req.setTimeout(10000, () => {
    res.status(408).json({
      error:
        "The server timed out waiting for the request. Please check your connection or try again later",
    });
  });
  next();
});*/

apiRoutes(app);

/*
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
*/

/*
if (!process.env['VITE']) {
  const frontendFiles = process.cwd() + '/dist'
  app.use(express.static(frontendFiles))
  app.get('/*', (_, res) => {
    res.send(frontendFiles + '/index.html')
  })
  app.listen(process.env['PORT'])
}
*/
