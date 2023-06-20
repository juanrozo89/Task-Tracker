import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
export const app = express();

// import path from "path";
// import helmet from "helmet";
import apiRoutes from "./api.ts";
// import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
// app.use(helmet());

const oneMonth = 1000 * 60 * 60 * 24 * 7 * 30;
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneMonth },
    resave: false,
  })
);
app.use(cookieParser());

declare module "express-session" {
  export interface SessionData {
    user: string;
  }
}

app.use((req, res, next) => {
  if (req.session.user) {
    res.send(req.session.user);
  }
  next();
});

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
