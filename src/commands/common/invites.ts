import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { EmbedCreator } from "../../functions/functions";

export default new Command({
  name: "invites",
  description: "[Member] Veja quantos invites você possui ou os de um usuário.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Selecione o usuário que deseja ver os invites.`,
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    let user = interaction.options.getUser("usuário");
    if (!user) user = interaction.user;
    let invites = await interaction.guild?.invites.fetch();
    let userInv = invites?.filter(
      (u) => u.inviter && u.inviter.id === user?.id
    );
    let i = 0;
    userInv?.forEach((inv) => (i += inv.uses as number));
    if (user.id === interaction.user.id) {
      const embed1 = await EmbedCreator({
        description: `Você possui **${i}** invites.`,
      });
      await interaction.reply({ embeds: [embed1] });
    } else {
      const embed2 = await EmbedCreator({
        description: `O usuário ${user} possui **${i}** invites.`,
      });
      await interaction.reply({ embeds: [embed2] });
    }
  },
});
