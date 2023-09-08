import express from "express";
//import { Request, Response, NextFunction } from "express";
export const app = express();

import dotenv from "dotenv";
dotenv.config();

import apiRoutes from "./api.ts";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";

import { REQ_TIMEOUT_SERVER } from "../src/constants";

declare module "express-session" {
  export interface SessionData {
    user: string;
    resetToken: string;
  }
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));
app.use(cookieParser());
app.use(helmet());

// Middleware to validate and sanitize input
import { query, body } from "express-validator";
app.use((req, res, next) => {
  body("*").escape()(req, res, () => {});
  query("*").escape()(req, res, () => {});
  next();
});

// Request timeout limit
app.use((req, res, next) => {
  req.setTimeout(REQ_TIMEOUT_SERVER, () => {
    res.status(408).json({
      error:
        "Sorry fot the inconveniences! The server timed out waiting for the request. Please try again later",
    });
  });
  next();
});

// Initialize session store
app.use(
  session({
    secret: process.env.SESSIONS_KEY!,
    saveUninitialized: true,
    unset: "keep",
    cookie: {
      secure: false, // Set to true in production for HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 * 30, // one month
    },
    resave: false,
  })
);

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
