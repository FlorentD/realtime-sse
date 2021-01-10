function guidGenerator() {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

const sendEvent = ({ event, data }) => {
  return `id:${guidGenerator()} \nevent: ${event}\ndata: ${JSON.stringify({
    ...data,
    update: Date.now(),
  })}\n\n`;
};

module.exports = { sendEvent };
