import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../../configs/types/Command";
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
      let guild = new EmbedBuilder()
        .setColor(`#9600D8`)
        .setTitle(`${interaction.guild?.name}`)
        .setTimestamp()
        .setImage(servericon || null);

      interaction.reply({ embeds: [guild] });
    }
  },
});
