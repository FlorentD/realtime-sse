const { request, gql } = require("graphql-request");
const flow = require("lodash/fp/flow");
const getOr = require("lodash/fp/getOr");
const map = require("lodash/fp/map");
const reduce = require("lodash/fp/reduce");
const eventEmitter = require("./event-emitter");
const {
  getKissKissBankBankValue,
  setKissKissBankBankValue,
} = require("./amounts");

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
        collectedAmount: (project?.node?.collectedAmount?.cents || "") / 100,
      })),
      reduce((acc, project) => acc + project.collectedAmount, 0)
    )(result);
    if (amount !== getKissKissBankBankValue()) {
      eventEmitter.emit("kisskissbankbank", amount);
      setKissKissBankBankValue(amount);
    }
  } catch (error) {
    console.error(error.message);
  }
};

const onKissKissChange = (cb) => {
  const callback = (amount) => {
    cb(amount);
  };
  eventEmitter.on("kisskissbankbank", callback);
  return () => eventEmitter.off("kisskissbankbank", callback);
};

module.exports = { getKissKissStat, onKissKissChange };
