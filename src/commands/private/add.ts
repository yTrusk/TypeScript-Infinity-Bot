import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Guild,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
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
    const userpremium = await prisma.userProfile.findUnique({where: {user_id: u.id as string}});
    if (userpremium?.premium === true) {
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
        try {
          await userCreate(gid.id as string, u.id as string, q)
        } catch { }
        interaction.editReply({ embeds: [embed] }).then(async () => {
          const embed = embeddesc(
            `<a:certo:1084630932885078036> **Adição de saldo concluida com sucesso.**`,
            interaction
          );
          interaction.editReply({ embeds: [embed] });
        });
        return;
      } else {
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
        return;
      }
    } else {
      interaction.editReply({ content: `<a:errado:1084631043757310043> **Erro, para utilizar este comando precisa ser adm e ter comprado o modulo premium.**` });
    }
  },
});
