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
    console.log(`Exibindo informações...`.rainbow);
    setTimeout(() => {
      console.log(`⚙ Configurando comandos...`.red);
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
                console.log(fileName.green);
              }, 500);
            } else {
              console.log(`Comandos carregados: Não encontrado`.red);
            }
          });
      });
    }, 7000);
    setTimeout(() => {
      if (buttons.size !== 0) {
        console.log(`Buttons carregados: ${buttons.size}`.green);
      } else {
        console.log(`Buttons carregados: Não encontrado`.red);
      }

      if (selects.size !== 0) {
        console.log(`Selects Menus carregados: ${selects.size}`.green);
      } else {
        console.log(`Selects Menus carregados: Não encontrado`.red);
      }

      if (modals.size !== 0) {
        console.log(`Modals carregados: ${modals.size}`.green);
      } else {
        console.log(`Modals carregados: Não encontrado`.red);
      }
    }, 9000);

    let canal = client.channels.cache.get("1074489520965296251") as VoiceChannel;
    if (!canal)
      return console.log(`❌ Não foi possivél entrar no canal de voz.`.red);
  
    try {
      joinVoiceChannel({
        channelId: canal.id,
        guildId: canal.guild.id,
        adapterCreator: canal.guild.voiceAdapterCreator,
      });
      console.log(`✅ Entramos no canal de voz com sucesso.
      ✅ Logado no bot: ${client.user?.username}`);
    } catch (e) {
      console.log(`❌ Não foi possivél entrar no canal de voz.`.red);
    }    
  },
});
