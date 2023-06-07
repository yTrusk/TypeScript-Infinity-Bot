import { ExtendedClient } from "./configs/ExtendedClient";
export const client = new ExtendedClient();
client.start();
import { errorreport } from "./functions/functions";
import util from "util";

process.on("multipleResolutions", (type, reason, promise) => {
  const report = `🚫 Erro Detectado 1:\n\n ${type}\n${reason}\n${util.inspect(
    promise,
    {
      showHidden: false,
      depth: null,
    }
  )}`;
  errorreport(report);
});
process.on("unhandledRejection", (reason, promise) => {
  const report = `🚫 Erro Detectado 2:\n\n ${reason}\n${util.inspect(promise, {
    showHidden: false,
    depth: null,
  })}`;
  errorreport(report);
});
process.on("uncaughtException", (error, origin) => {
  const report = `🚫 Erro Detectado 3:\n\n ${error}\n${origin}`;
  errorreport(report);
});
process.on("uncaughtExceptionMonitor", (error, origin) => {
  const report = `🚫 Erro Detectado 4:\n\n ${error}\n${origin}`;
  errorreport(report);
});
