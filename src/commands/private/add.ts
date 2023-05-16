import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  Guild,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc, handle, userCreate } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "add",
  description: "[Economia] Adicione saldo para um usuário.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Selecione um usuário.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: `quantidade`,
      description: `Selecione a quantidade de moedas que deseja adicionar.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({});
    const u = options.getUser("usuário") as User;
    const q = options.getNumber("quantidade") as number;
    const embed = embeddesc(
      `<a:carregando:1084633391820980254> **Processando adição de saldo...**`,
      interaction
    );
    const gid = interaction.guild as Guild;
    let userGuild = await prisma.user.findUnique({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guildId as string,
          user_id: u?.id as string,
        },
      },
    });
        const bal = userGuild?.balance as number;

    if (!userGuild) {
     const [user, userError] = await handle(
       userCreate(interaction.guild?.id, interaction.user.id)
     );
    }
    await prisma.user.update({
      where: {
        guild_id_user_id: {
          guild_id: gid.id,
          user_id: u.id,
        },
      },
      data: {
        balance: bal + q,
      },
    });
    interaction.editReply({ embeds: [embed] }).then(async () => {
      const embed = embeddesc(
        `<a:certo:1084630932885078036> **Adição de saldo concluida com sucesso.**`,
        interaction
      );
      interaction.editReply({ embeds: [embed] });
    });
  },
});
