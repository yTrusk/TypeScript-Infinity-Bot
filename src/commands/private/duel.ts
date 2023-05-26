import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  TextChannel,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { PrismaClient } from "@prisma/client";
import {
  buttonsRow,
  embed1,
  embeddesc,
  handle,
  userCreate,
} from "../../functions/functions";
const prisma = new PrismaClient();

import ms from "ms";
interface Cooldown {
  lastCmd: number | null;
}

const cooldowns: { [userId: string]: Cooldown } = {};
export default new Command({
  name: "duelo",
  description:
    "[Economia] Duele com seus amigos e tenha a chance de ganhar a grana deles.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Digite a quantidade que deseja apostar no double.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "usuário",
      description: "Selecione um usuário que deseja fazer a aposta.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({});
    let user2 = options.getUser("usuário") as User;
    let users = interaction.user as User;
    let q = options.getNumber("quantidade") as number;
    const gid = interaction.guildId as string;
    let userGuild = await prisma.user.findUnique({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guildId as string,
          user_id: users?.id as string,
        },
      },
    });
    let userGuild2 = await prisma.user.findUnique({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guildId as string,
          user_id: user2?.id as string,
        },
      },
    });
    if (!userGuild) {
      const [user, userError] = await handle(
        userCreate(interaction.guild?.id as string, users?.id)
      );
    }
    const userGuildBalance = userGuild?.balance as number
    if (!userGuild2) {
      userGuild = await userCreate(interaction.guild?.id as string, user2?.id);
    }
    const userGuild2Balance = userGuild2?.balance as number

    if (userGuildBalance < q) {
      interaction.editReply({
        content: `Você não possui moedas suficientes para desafiar.`,
      });
      return;
    } else if (userGuild2Balance < q) {
      interaction.editReply({
        content: `O usuário mencionado, não há moedas o suficiente para aceitar.`,
      });
      return;
    } else {
      if (!cooldowns[users.id]) cooldowns[users.id] = { lastCmd: null };
      let ultimoCmd = cooldowns[users.id].lastCmd;
      let timeout = ms("30s"); // Coloque em ms o tempo
      if (ultimoCmd !== null && timeout - (Date.now() - ultimoCmd) > 0) {
        let time = Math.ceil((timeout - (Date.now() - ultimoCmd)) / 1000);
        let resta = `${time} segundos`;
        if (time == 0) resta = "alguns milisegundos";
        if (time == 1) resta = "1 segundo";
        const embed_err = embed1(
          `❌ Erro, duelo em cooldown!`,
          `Vagabundo querendo trapacear né? Espera \`${time}\` para duelar novamente!`
        );
        interaction.editReply({ embeds: [embed_err] });
        return;
      } else {
        cooldowns[users.id].lastCmd = Date.now();
      }
      const embed = embed1(
        `<:Modicon:1065654040874188870> Duelo de Apostas`,
        `<:mais:1084631761406931024> **Desafiante:** ${users} \n<:menos:1084631141945966722> **Desafiado:** ${user2}\n<:coins:1095800360829980762> **Quantidade:** \`${q}\``
      );
      const row = buttonsRow([
        {
          id: `recusarduelo`,
          emoji: `<a:errado:1084631043757310043>`,
          disabled: false,
          label: `recusar`,
          style: ButtonStyle.Danger,
        },
        {
          id: `aceitarduelo`,
          emoji: `<a:certo:1084630932885078036>`,
          disabled: false,
          label: `aceitar`,
          style: ButtonStyle.Success,
        },
      ]);
      const row2 = buttonsRow([
        {
          id: `recusarduelo`,
          emoji: `<a:errado:1084631043757310043>`,
          disabled: true,
          label: `recusar`,
          style: ButtonStyle.Danger,
        },
        {
          id: `aceitarduelo`,
          emoji: `<a:certo:1084630932885078036>`,
          disabled: true,
          label: `aceitar`,
          style: ButtonStyle.Success,
        },
      ]);
      interaction.editReply({ embeds: [embed], components: [row] });
      const filter = (i: { customId: string }) =>
        i.customId === "recusarduelo" || i.customId === "aceitarduelo";
      const ch = interaction.channel as TextChannel;
      const collector = ch.createMessageComponentCollector({
        filter: (secso) => secso.member.id == user2.id,
      });
      collector.on("collect", async (i) => {
        if (i.customId === "recusarduelo") {
          const embed = embeddesc(
            `**O usuário: ${user2} recusou o duelo**`,
            interaction
          );
          interaction.editReply({ embeds: [embed], components: [row2] });
        } else if (i.customId === "aceitarduelo") {
          let roll = Math.ceil(Math.random() * 10);
          if (roll < 6) {
            await prisma.user.update({
              where: {
                guild_id_user_id: {
                  guild_id: gid,
                  user_id: users?.id as string,
                },
              },
              data: {
                balance: userGuildBalance + q,
              },
            });
            await prisma.user.update({
              where: {
                guild_id_user_id: {
                  guild_id: gid,
                  user_id: user2?.id as string,
                },
              },
              data: {
                balance: userGuild2Balance - q,
              },
            });
            const embed = embed1(
              `<:Modicon:1065654040874188870> Duelo finalizado`,
              `<:trofeu:1095798926927462472> **Ganhador:** ${users} \n🦆 **Perdedor:** ${user2}\n<:coins:1095800360829980762> **Quantidade:** \`${q}\` `
            );
            interaction.editReply({ embeds: [embed], components: [row2] });
          } else {
            await prisma.user.update({
              where: {
                guild_id_user_id: {
                  guild_id: gid,
                  user_id: users?.id as string,
                },
              },
              data: {
                balance: userGuildBalance - q,
              },
            });
            await prisma.user.update({
              where: {
                guild_id_user_id: {
                  guild_id: gid,
                  user_id: user2?.id as string,
                },
              },
              data: {
                balance: userGuild2Balance + q,
              },
            });
            const embed = embed1(
              `<:Modicon:1065654040874188870> Duelo finalizado`,
              `<:trofeu:1095798926927462472> **Ganhador:** ${user2} \n🦆 **Perdedor:** ${users}\n<:coins:1095800360829980762> **Quantidade:** \`${q}\` `
            );
            interaction.editReply({ embeds: [embed], components: [row2] });
          }
        }
      });
    }
  },
});
