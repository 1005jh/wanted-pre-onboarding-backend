require("dotenv").config();
const express = require("express");
const app = express();
const moment = require("moment");
require("moment-timezone");
const helmet = require("helmet");
moment.tz.setDefault("Asia/Seoul");
const expressSanitizer = require("express-sanitizer");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");
const http = require("http");
const HTTPS = require("https");

const cors = require("cors");
const routes = require("./routes");

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(cookieParser());
app.use("/", routes);
let server;
let options = {};
if (process.env.LOCAL === "true") {
  options["httpsOptions"] = {
    key: fs.readFileSync("../.cert/key.pem", "utf-8"),
    cert: fs.readFileSync("../.cert/cert.pem", "utf-8"),
  };

  server = HTTPS.createServer(options, app);
  server.listen(3002, () => {
    console.log("HTTPS server open :: " + 3002);
  });
} else {
  app.listen(3002, () => {
    console.log("server open :: " + 3002);
  });
}

module.exports = server;
