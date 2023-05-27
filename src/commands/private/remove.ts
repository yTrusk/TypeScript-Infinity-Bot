import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc, userCreate } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "remove",
  description: "[Economia] Remova um saldo de um usuário.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "usuário",
      description: "Selecione o usuário que deseja remover o saldo.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "quantidade",
      description: "Digite a quantidade que deseja remover.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const user = options.getUser("usuário");
    const many = options.getNumber("quantidade") as number;
    const userguild = await client.prisma.user.findUnique({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guild?.id as string,
          user_id: user?.id as string,
        },
      },
    });
    if (!userguild) {
      await userCreate(interaction.guild?.id, user?.id);
    }
    const bal = userguild?.balance as number;
    const userguildupdated = await client.prisma.user.update({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guild?.id as string,
          user_id: user?.id as string,
        },
      },
      data: { balance: bal - many },
    });
    const embed = embeddesc(
      ` Remoção de saldo concluida com sucesso.\nSaldo do usuário: ${userguildupdated.balance}`,
      interaction
    );
    interaction.reply({ embeds: [embed] });
  },
});
