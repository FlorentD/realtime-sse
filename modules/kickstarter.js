const fetch = require("node-fetch");
const flow = require("lodash/fp/flow");
const getOr = require("lodash/fp/getOr");
const reduce = require("lodash/fp/reduce");
const concat = require("lodash/fp/concat");
const slice = require("lodash/fp/slice");
const eventEmitter = require("../sse/event-emitter");
const { getKickstarterValue, setKickstarterValue } = require("../sse/amounts");

const getKickstaterStats = async () => {
  try {
    const firstPageReponse = await fetch(
      "https://www.kickstarter.com/projects/search.json?woe_id=23424819&sort=popularity&page=1"
    );
    const firstPageJson = await firstPageReponse.json();
    const secondPageReponse = await fetch(
      "https://www.kickstarter.com/projects/search.json?woe_id=23424819&sort=popularity&page=2"
    );
    const secondPageJson = await secondPageReponse.json();
    const amount = flow(
      getOr([])("projects"),
      concat(flow(getOr([])("projects"))(secondPageJson)),
      slice(0)(16),
      reduce((acc, project) => acc + project.converted_pledged_amount, 0)
    )(firstPageJson);
    if (amount !== getKickstarterValue()) {
      eventEmitter.emit("kickstarter", amount);
      setKickstarterValue(amount);
    }
  } catch (e) {
    console.error(e);
  }
};

const onKickstarterChange = (cb) => {
  const callback = (amount) => {
    cb(amount);
  };
  eventEmitter.on("kickstarter", callback);
  return () => eventEmitter.off("kickstarter", callback);
};

module.exports = { getKickstaterStats, onKickstarterChange };
