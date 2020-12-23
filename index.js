const EventEmitter = require("events");
const express = require("express");
const https = require("https");
const app = express();
const cors = require("cors");
const sse = require("server-sent-events");
const { request, gql } = require("graphql-request");
const flow = require("lodash/fp/flow");
const getOr = require("lodash/fp/getOr");
const map = require("lodash/fp/map");
const reduce = require("lodash/fp/reduce");

const eventEmitter = new EventEmitter();
const INTERVAL_CALLING = 5000;

const amounts = {
  kisskissbankbank: 0,
  ulule: 0,
};

const query = gql`
  {
    projectsBySelection(scope: popular, first: 16) {
      edges {
        node {
          id
          name
          shortDesc
          publicUrl
          fundingPercent
          collectedAmount {
            cents
          }
          collectedCount
          owner {
            username
            avatarImage {
              url
            }
          }
          image {
            url
          }
        }
      }
    }
  }
`;

const getKissKissStat = async () => {
  try {
    const result = await request(
      "https://www.kisskissbankbank.com/graphql",
      query
    );
    const amount = flow(
      getOr([])("projectsBySelection.edges"),
      map((project) => ({
        collectedAmount: getOr("")("node.collectedAmount.cents")(project) / 100,
      })),
      reduce((acc, project) => acc + project.collectedAmount, 0)
    )(result);
    if (amount !== amounts.kisskissbankbank) {
      eventEmitter.emit("kisskissbankbank", amount);
      amounts.kisskissbankbank = amount;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const getUluleState = () => {
  https
    .get(
      "https://api.ulule.com/v1/search/projects?q=sort:popular+status:currently&lang=fr",
      (res) => {
        let projects = "";
        res.on("data", (chunk) => {
          projects += chunk;
        });
        res.on("end", () => {
          const amount = flow(
            getOr([])("projects"),
            reduce((acc, project) => acc + project.amount_raised, 0)
          )(JSON.parse(projects));
          if (amount !== amounts.ulule) {
            eventEmitter.emit("ulule", amount);
            amounts.ulule = amount;
          }
        });
      }
    )
    .on("error", (error) => {
      console.error(error.message);
    });
};

setInterval(() => {
  getKissKissStat();
  getUluleState();
}, INTERVAL_CALLING);

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
  eventEmitter.on("kisskissbankbank", (amount) => {
    res.sse(
      `event: kisskissbankbank\ndata: ${JSON.stringify({
        amount,
        update: Date.now(),
      })}\n\n`
    );
  });
  eventEmitter.on("ulule", (amount) => {
    res.sse(
      `event: ulule\ndata: ${JSON.stringify({
        amount,
        update: Date.now(),
      })}\n\n`
    );
  });
});

app.get("/api", (req, res) => {
  res.json(amounts);
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || port}`
  );
});
