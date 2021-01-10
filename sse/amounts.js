const amounts = {
  kisskissbankbank: 0,
  ulule: 0,
  kickstarter: 0,
};

module.exports = {
  getAmounts: () => amounts,
  getKissKissBankBankValue: () => amounts.kisskissbankbank,
  setKissKissBankBankValue: (value) => (amounts.kisskissbankbank = value),
  getUluleValue: () => amounts.ulule,
  setUluleValue: (value) => (amounts.ulule = value),
  getKickstarterValue: () => amounts.kickstarter,
  setKickstarterValue: (value) => (amounts.kickstarter = value),
};
