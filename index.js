const express = require("express");
const app = express();
const cors = require("cors");
const sse = require("server-sent-events");
const port = 3000;

const allowlist = ["https://kissbankule.vercel.app/"];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use("/", express.static("public"));

app.get("/sse", sse, (req, res) => {
  res.sse("event: coucou\ndata: im from the server\n\n");
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || port}`
  );
});
