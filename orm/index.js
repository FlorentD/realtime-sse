const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { onKissKissChange } = require("../modules/kisskissbankbank");
const { onUluleChange } = require("../modules/ulule");
const { onKickstarterChange } = require("../modules/kickstarter");

const getRecords = async () => {
  const allRecords = await prisma.record.findMany();
  return allRecords;
};

const addRecord = async ({ plateform, amount }) => {
  const record = await prisma.record.create({
    data: {
      amount,
      plateform,
    },
  });
  return record;
};

const recording = () => {
  onKissKissChange(async (amount) => {
    await addRecord({ plateform: "kisskissbankbank", amount });
  });

  onUluleChange(async (amount) => {
    await addRecord({ plateform: "ulule", amount });
  });

  onKickstarterChange(async (amount) => {
    await addRecord({ plateform: "kickstarter", amount });
  });
};

module.exports = { getRecords, addRecord, recording };
