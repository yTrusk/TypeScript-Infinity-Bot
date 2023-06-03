import { ExtendedClient } from "./configs/ExtendedClient";
export const client = new ExtendedClient();
client.start();
import { scheduleJob } from "node-schedule";
import { errorreport, verificarUsersPremium } from "./functions/functions";
const job = scheduleJob("*/40 * * * *", () => {
  verificarUsersPremium();
});
import util from "util";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://99ff8f6636434cfd995496b53071b943@o4505280404652032.ingest.sentry.io/4505280832208896",
  tracesSampleRate: 1.0,
});

process.on("multipleResolutions", (type, reason, promise) => {
  const report = `🚫 Erro Detectado 1:\n\n ${type}\n${reason}\n${util.inspect(
    promise,
    {
      showHidden: false,
      depth: null,
    }
  )}`;
  console.log(report);
  errorreport(report);
});
process.on("unhandledRejection", (reason, promise) => {
  const report = `🚫 Erro Detectado 2:\n\n ${reason}\n${util.inspect(promise, {
    showHidden: false,
    depth: null,
  })}`;
  console.log(report);
  errorreport(report);
});

process.on("uncaughtException", (error, origin) => {
  const report = `🚫 Erro Detectado 3:\n\n ${error}\n${origin}`;
  console.log(report);
  errorreport(report);
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
  const report = `🚫 Erro Detectado 4:\n\n ${error}\n${origin}`;
  console.log(report);
  errorreport(report);
});
