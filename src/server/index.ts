import express from "express";
export const app = express();

// import path from "path";
// import helmet from "helmet";
import apiRoutes from "./api.ts";
import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
// app.use(helmet());

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
