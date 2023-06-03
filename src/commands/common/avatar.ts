import { ApplicationCommandType } from "discord.js";
import { Command } from "../../configs/types/Command";
import { EmbedCreator } from "../../functions/functions";
export default new Command({
  name: "avatar-guild",
  description: "[Member] Exibe a foto do servidor.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    const servericon = interaction.guild?.iconURL();

    if (!servericon) {
      interaction.reply({
        content: `Foto do servidor não definida.`,
        ephemeral: true,
      });
    } else {
      const guild = await EmbedCreator({
        title: `${interaction.guild?.name}`,
        image: servericon,
      });
      interaction.reply({ embeds: [guild] });
    }
  },
});
