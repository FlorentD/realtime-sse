const https = require("https");
const flow = require("lodash/fp/flow");
const getOr = require("lodash/fp/getOr");
const reduce = require("lodash/fp/reduce");
const { getUluleValue, setUluleValue } = require("./amounts");
const eventEmitter = require("./event-emitter");

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
          if (amount !== getUluleValue()) {
            eventEmitter.emit("ulule", amount);
            setUluleValue(amount);
          }
        });
      }
    )
    .on("error", (error) => {
      console.error(error.message);
    });
};

const onUluleChange = (cb) => {
  const callback = (amount) => {
    cb(amount);
  };
  eventEmitter.on("ulule", callback);
  return () => eventEmitter.off("ulule", callback);
};

module.exports = { getUluleState, onUluleChange };
