import { ApplicationCommandType } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { EmbedCreator } from "../../functions/functions";

export default new Command({
  name: "ping",
  description: "[Member] Exibe meu tempo de resposta e WebSocket.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    let now_time = Date.now();
    const embed = await EmbedCreator({ description: `**Calculando ping...**` });
    interaction.reply({ embeds: [embed] }).then(async () => {
      const embed2 = await EmbedCreator({
        description: `🕑 **Tempo de resposta: ${
          Date.now() - now_time
        }ms** \n🌍 **WebSocket: ${client.ws.ping}ms**`,
      });
      interaction.editReply({ embeds: [embed2] });
    });
  },
});
