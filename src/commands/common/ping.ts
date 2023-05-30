import { ApplicationCommandType } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { embeddesc } from "../../functions/functions";

export default new Command({
  name: "ping",
  description: "[Member] Exibe meu tempo de resposta e WebSocket.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    let now_time = Date.now();
    const embed = embeddesc(`**Calculando ping...**`, interaction);
    interaction.reply({ embeds: [embed] }).then(() => {
      const embed2 = embeddesc(
        `🕑 **Tempo de resposta: ${
          Date.now() - now_time
        }ms** \n🌍 **WebSocket: ${client.ws.ping}ms**`,
        interaction
      );
      interaction.reply({ embeds: [embed2] });
    });
  },
});
