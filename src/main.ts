import { ExtendedClient } from "./configs/ExtendedClient";
export const client = new ExtendedClient();
client.start();
import { scheduleJob } from "node-schedule";
import { errorreport, verificarUsersPremium } from "./functions/functions";
const job = scheduleJob("*/5 * * * *", () => {
  verificarUsersPremium();
});
import util from "util";

process.on("multipleResolutions", (type, reason, promise) => {
  const report = `🚫 Erro Detectado:\n\n ${type}\n${reason}\n${util.inspect(
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
  const report = `🚫 Erro Detectado:\n\n ${reason}\n${util.inspect(promise, {
    showHidden: false,
    depth: null,
  })}`;
  console.log(report);
  errorreport(report);
});

process.on("uncaughtException", (error, origin) => {
  const report = `🚫 Erro Detectado:\n\n ${error}\n${origin}`;
  console.log(report);
  errorreport(report);
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
  const report = `🚫 Erro Detectado:\n\n ${error}\n${origin}`;
  console.log(report);
  errorreport(report);
});
