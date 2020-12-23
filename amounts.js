const amounts = {
  kisskissbankbank: 0,
  ulule: 0,
};

module.exports = {
  getAmounts: () => amounts,
  getKissKissBankBankValue: () => amounts.kisskissbankbank,
  getUluleValue: () => amounts.ulule,
  setKissKissBankBankValue: (value) => (amounts.kisskissbankbank = value),
  setUluleValue: (value) => (amounts.ulule = value),
};
