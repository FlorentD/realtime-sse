const express = require("express");
const app = express();
const cors = require("cors");
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

app.get("/", cors(corsOptionsDelegate), (req, res) => {
  res.status(200).set({
    connection: "keep-alive",
    "cache-control": "no-cache",
    "content-type": "application/json",
  });
  const data = { message: "hello, world!" };
  setInterval(() => {
    data.timesamp = Date.now();
    res.write(JSON.stringify(data));
  }, 2000);
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || port}`
  );
});
