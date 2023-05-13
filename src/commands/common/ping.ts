import { ApplicationCommandType, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputStyle } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { buttonsRow, embeddesc, inputBuilder } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "ping",
  description: "[Member] Exibe meu tempo de resposta e WebSocket.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;

    let now_time = Date.now();
    const embed = embeddesc(`**Calculando ping...**`, interaction);
    const embed2 = embeddesc(
      `🕑 **Tempo de resposta: ${Date.now() - now_time}ms** \n🌍 **WebSocket: ${
        client.ws.ping
      }ms**`, interaction
    );
    const row = buttonsRow([
      {
        disabled: false,
        emoji: '✅',
        id: 'test',
        label: `test`,
        style: ButtonStyle.Success
      }
    ])
    interaction.reply({ embeds: [embed] }).then(() => {
      interaction.editReply({ embeds: [embed2], components: [row] });
    });
  },
});
