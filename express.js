const express = require("express");
const app = express();
const sse = require("server-sent-events");
const { getKissKissStat, onKissKissChange } = require("./kisskiss-module");
const { getUluleState, onUluleChange } = require("./ulule-module");
const { getKickstaterStats } = require("./modules/kickstarter");
const { sendEvent } = require("./sse");
const { getAmounts } = require("./amounts");

const INTERVAL_CALLING = 5000;

setInterval(() => {
  getKissKissStat();
  getUluleState();
  getKickstaterStats();
}, INTERVAL_CALLING);

const port = 3000;

app.use("/", express.static("public"));

app.get("/sse", sse, (req, res) => {
  console.log("req, res");
  onKissKissChange((amount) =>
    res.sse(
      sendEvent({
        event: "kisskissbankbank",
        data: { amount },
      })
    )
  );
  onUluleChange((amount) =>
    res.sse(
      sendEvent({
        event: "ulule",
        data: { amount },
      })
    )
  );
});

app.get("/api", (req, res) => {
  res.json(getAmounts());
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || port}`
  );
});
