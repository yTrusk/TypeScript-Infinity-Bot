import { client } from "../../main";
import { Event } from "../../configs/types/event";
import path from "path";
import fs from "fs";
import { joinVoiceChannel } from "@discordjs/voice";
import { ActivityType, VoiceChannel } from "discord.js";
export * from "colors";
export default new Event({
  name: "ready",
  once: true,
  run() {
    const { commands } = client;
    console.log(`Comandos indentificados: ${commands.size}`.cyan);
    const commandPath = path.join(__dirname, "../../", "commands");
    const fileCondition = (fileName: string) =>
      fileName.endsWith(".ts") || fileName.endsWith(".js");
    fs.readdirSync(commandPath).forEach((local) => {
      fs.readdirSync(commandPath + `/${local}/`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          if (commands.size > 0) {
            console.log(`[Commands] - ${fileName} loaded`.green);
          } else {
            console.log(`Comandos carregados: Não encontrado`.red);
          }
        });
    });
    let canal = client.channels.cache.get(
      "1074489520965296251"
    ) as VoiceChannel;
    if (!canal)
      return console.log(
        `❌ Não foi possivél entrar no canal de voz.
      ✅ Logado no bot: ${client.user?.username}`.red
      );
    try {
      joinVoiceChannel({
        channelId: canal.id,
        guildId: canal.guild.id,
        adapterCreator: canal.guild.voiceAdapterCreator,
      });
      console.log(`✅ Entramos no canal de voz com sucesso.
      ✅ Logado no bot: ${client.user?.username}`);
    } catch (e) {
      console.log(
        `❌ Não foi possivél entrar no canal de voz.
      ✅ Logado no bot: ${client.user?.username}`.red
      );
    }
    let activities = [
      `Ajudando: ${client.guilds.cache.size} servidores.`,
      `Observando: ${client.users.cache.size} usuários.`,
    ];
    let i = 0;
    setInterval(() => {
      client.user?.setActivity(`${activities[i++ % activities.length]}`, {
        type: ActivityType.Streaming,
        url: "https://discord.gg/CH5bPQSB8r",
      });
    }, 300000);
    client.user?.setStatus(`online`);
  },
});
