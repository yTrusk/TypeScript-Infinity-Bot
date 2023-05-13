import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc } from "../../functions/functions";
const prisma = new PrismaClient();

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
      const embed1 = embeddesc(`Você possui **${i}** invites.`, interaction);

      await interaction.reply({ embeds: [embed1] });
    } else {
      const embed2 = embeddesc(
        `O usuário ${user} possui **${i}** invites.`,
        interaction
      );

      await interaction.reply({ embeds: [embed2] });
    }
  },
});
