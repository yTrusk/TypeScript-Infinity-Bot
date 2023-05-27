import { ExtendedClient } from "./configs/ExtendedClient";
export const client = new ExtendedClient();
client.start();
import { scheduleJob } from "node-schedule";
import { verificarUsersPremium } from "./functions/functions";
const job = scheduleJob("*/1 * * * *", () => {
  verificarUsersPremium();
});
