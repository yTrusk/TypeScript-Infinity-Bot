import { client } from "../../main";
import { Event } from "../../configs/types/event";
import path from "path";
import fs from "fs";
import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
export * from "colors";
export default new Event({
  name: "ready",
  once: true,
  run() {
    const { commands, buttons, selects, modals } = client;
    console.log(`Exibindo informações...`);
    setTimeout(() => {
      console.log(`⚙ Configurando comandos...`);
    }, 1500);
    setTimeout(async () => {
      console.log(`Comandos indentificados: ${commands.size}`.cyan);
      console.log(`Buttons indentificados: ${buttons.size}`.cyan);
      console.log(`Selects Menus indentificados: ${selects.size}`.cyan);
      console.log(`Modals indentificados: ${modals.size}`.cyan);
    }, 3000);
    setTimeout(() => {
        console.log(`Comandos carregados:`.green);
    }, 6000)
    setTimeout(() => {
      const commandPath = path.join(__dirname, "../../", "commands");
      const fileCondition = (fileName: string) =>
        fileName.endsWith(".ts") || fileName.endsWith(".js");

      fs.readdirSync(commandPath).forEach((local) => {
        fs.readdirSync(commandPath + `/${local}/`)
          .filter(fileCondition)
          .forEach(async (fileName) => {
            if (commands.size > 0) {
              setTimeout(() => {
                console.log(`[Commands] - ${fileName} loaded`.green);
              }, 500);
            } else {
              console.log(`Comandos carregados: Não encontrado`.red);
            }
          });
      });
    }, 7000);

    let canal = client.channels.cache.get("1074489520965296251") as VoiceChannel;
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
  },
});
