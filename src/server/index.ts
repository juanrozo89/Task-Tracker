import express from "express";
export const app = express();

import dotenv from "dotenv";
dotenv.config();

import apiRoutes from "./api.ts";
import cookieParser from "cookie-parser";
import session from "express-session";

import MongoDBSession from "connect-mongodb-session";
const MongoDBStore = MongoDBSession(session);
const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI_SESSIONS!,
    collection: "sessions",
  },
  (error) => {
    if (error) {
      console.error("Error connecting to MongoDBStore: ", error);
    }
  }
);
store.on("connected", () => {
  console.log("Succesfully connected to MongoDBStore");
});

// import helmet from "helmet";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(helmet());

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

declare module "express-session" {
  export interface SessionData {
    user: string;
  }
}

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
