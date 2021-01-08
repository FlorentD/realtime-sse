const http2 = require("http2");
const fs = require("fs");
const next = require("next");
const Index = require("koa");
const compress = require("koa-compress");
const { PassThrough } = require("stream");
const serve = require("koa-static");
const Router = require("koa-router");
const { getAmounts } = require("./amounts");
const { sendEvent } = require("./sse");
const { getKissKissStat, onKissKissChange } = require("./kisskiss-module");
const { getUluleState, onUluleChange } = require("./ulule-module");
const {
  getKickstaterStats,
  onKickstarterChange,
} = require("./modules/kickstarter");

const INTERVAL_CALLING = 5000;
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  setInterval(() => {
    getKissKissStat();
    getUluleState();
    getKickstaterStats();
  }, INTERVAL_CALLING);

  const app = new Index();
  const router = new Router();

  router.get("/api", (ctx) => (ctx.body = getAmounts()));
  router.get("/sse", (ctx) => {
    const stream = new PassThrough();
    const closeKissKissEventEmitter = onKissKissChange((amount) =>
      stream.write(
        sendEvent({
          event: "kisskissbankbank",
          data: { amount },
        })
      )
    );
    const closeUluleEventEmitter = onUluleChange((amount) =>
      stream.write(
        sendEvent({
          event: "ulule",
          data: { amount },
        })
      )
    );
    const closeKickstarterEventEmitter = onKickstarterChange((amount) =>
      stream.write(
        sendEvent({
          event: "kickstarter",
          data: { amount },
        })
      )
    );
    ctx.req.on("close", () => {
      closeKissKissEventEmitter();
      closeUluleEventEmitter();
      closeKickstarterEventEmitter();
      ctx.res.end();
    });
    ctx.req.on("finish", () => {
      closeKissKissEventEmitter();
      closeUluleEventEmitter();
      closeKickstarterEventEmitter();
      ctx.res.end();
    });
    ctx.req.on("error", () => {
      closeKissKissEventEmitter();
      closeUluleEventEmitter();
      closeKickstarterEventEmitter();
      ctx.res.end();
    });
    ctx.type = "text/event-stream";
    ctx.body = stream;
  });

  router.all("(.*)", (ctx) => {
    return handle(ctx.req, ctx.res);
  });

  // response
  app.use(router.routes()).use(router.allowedMethods());
  app.use(compress());

  // http2
  //   .createSecureServer(
  //     {
  //       key: fs.readFileSync("certs/server.key"),
  //       cert: fs.readFileSync("certs/server.crt"),
  //     },
  //     app.callback()
  //   )
  //   .listen(8080);

  app.listen(PORT);
});
