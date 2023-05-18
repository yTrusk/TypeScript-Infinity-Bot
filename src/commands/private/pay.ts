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
import { embed1, handle, userCreate } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "pay",
  description: "[Economy]",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Selecione o usuário que deseja pagar.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: `quantidade`,
      description: `Digite a quantidade que você deseja enviar para o usuário.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: `mensagem`,
      description: `Envie uma mensagem de pagamento para a dm do usuário.`,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({});
    let userr = options.getUser("usuário") as User;
    if (userr.id != interaction.user.id) {
      const quantidade = options.getNumber("quantidade") as number;
      let user = interaction.user;
      let msg = options.getString("mensagem");
      if (!msg) msg = "Nenhuma mensagem inserida.";
      const gid = interaction.guild as Guild;
      const userrBalances = await prisma.user.findUnique({
        where: {
          guild_id_user_id: {
            guild_id: gid.id as string,
            user_id: userr.id as string,
          },
        },
      });
      const userBalances = await prisma.user.findUnique({
        where: {
          guild_id_user_id: {
            guild_id: gid.id as string,
            user_id: user.id as string,
          },
        },
      });
      if (!userrBalances) {
        try {
          await userCreate(gid.id as string, userr.id as string);
        } catch {}
      }
      if (!userBalances) {
        try {
          await userCreate(gid.id as string, user.id as string);
        } catch {}
      }
      let user1balance = userrBalances?.balance as number;
      const user2balance = userBalances?.balance as number;
      if (quantidade < 1) {
        interaction.editReply({ content: `você não pode doar menos que 1` });
        return;
      }
      if (user2balance < quantidade) {
        let emoji = `<a:errado:1084631043757310043>`;
        const embed_erro = embed1(
          `${emoji} Erro`,
          `${emoji} **Você não pode enviar mais do que possui.**`
        );
        interaction.editReply({ embeds: [embed_erro] });
        return;
      } else {
        if(!user1balance || isNaN(user1balance) === true || user1balance === null) user1balance = 0
        const soma = (user1balance + quantidade);
        await prisma.user.update({
          where: { guild_id_user_id: { guild_id: gid.id, user_id: userr.id } },
          data: { balance: soma},
        });
        await prisma.user.update({
          where: { guild_id_user_id: { guild_id: gid.id, user_id: user.id } },
          data: { balance: user2balance - quantidade },
        });
        const embed = embed1(
          `<a:certo:1084630932885078036> Transação concluida.`,
          `**Você enviou** \`${quantidade} space coins\` **para o** ${userr}.`
        );
        interaction.editReply({ embeds: [embed] }).then(async () => {
          const msgemb = embed1(
            `<:dinheiro:1084628513707016253> Você recebeu um pagamento!`,
            `<:cliente:1084634375997632582> **Usuário que te enviou:** ${user} \n<:coins:1095800360829980762> **Quantidade:** \`${quantidade}\` \n<:tabela:1084631840528281701> **Mensagem enviada:** \`\`\`${msg}\`\`\``
          );
          await interaction.user.send({ embeds: [embed] }).catch((err) => {
            let emoji = `<a:errado:1084631043757310043>`;
            interaction.channel?.send({
              content: `${emoji}**Erro ao enviar mensagem log para sua dm.**`,
            });
          });
          await userr.send({ embeds: [msgemb] }).catch((err) => {
            let emoji = `<a:errado:1084631043757310043>`;
            interaction.channel?.send({
              content: `${emoji} **Erro ao enviar mensagem ao usuário.**`,
            });
          });
        });
      }
      return;
    } else {
      interaction.editReply({
        content: `Você não pode enviar um pagamento para si mesmo.`,
      });
      return;
    }
  },
});
