import { ExtendedClient } from "./configs/ExtendedClient";
import { scheduleJob } from "node-schedule"
import { verificarUsersPremium } from "./functions/functions";
export const client = new ExtendedClient();
client.start();
const job = scheduleJob("*/1 * * * *",  () => {
   verificarUsersPremium();
});