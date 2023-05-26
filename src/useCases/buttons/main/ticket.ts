import {
  ButtonStyle,
  ChannelType,
  Guild,
  GuildMember,
  Message,
  User,
} from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { ticket, embed1, buttonsRow } from "../../../functions/functions";
import { PrismaClient } from "@prisma/client";
import { client } from "../../../main";
const prisma = new PrismaClient();
export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "ticket_system",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ interaction }: actionEventProps) {
    if (!interaction.isButton()) return;
    const u = interaction.user as User;
    const gid = interaction.guild as Guild;
    const nome_canal = `🔖-${u.id}`;
    const botmember = interaction.guild?.members.cache.find(
      (user) => user.id === client.user?.id
    ) as GuildMember;
    if (botmember.permissions.has(["ManageChannels", "SendMessages"])) {
      let canal = gid.channels.cache.find((c) => c.name === nome_canal);
      if (canal) {
        interaction.reply({
          content: `Olá **${interaction.user.username}**, você já possui um ticket em ${canal}.`,
          ephemeral: true,
        });
      } else {
        const sla = await prisma.config.findUnique({
          where: { guild_id: gid.id as string },
        });
        const slas = sla?.cateticket as string;
        const cate = gid.channels.cache.find(
          (c) => c.type === ChannelType.GuildCategory && c.id === slas
        );
        if (!cate) {
          interaction.reply({
            content: `<a:errado:1084631043757310043> **Categoria de ticket não encontrada**`,
            ephemeral: true,
          });
          return;
        } else {
          await ticket(nome_canal, cate, interaction).then(async (chat) => {
            await interaction.reply({
              content: `Olá **${interaction.user.username}**, seu ticket foi aberto em ${chat}.`,
              ephemeral: true,
            });
            const embed = embed1(
              `Ticket de: ${interaction.user.username}`,
              `**Olá ${interaction.user}, você abriu um ticket.**\n **Aguarde um momento para ser atendido por nossos staffs / moderadores, não tenha pressa e nem fique marcando a nossa equipe para que possamos ajudar a todos.**`
            );
            const closebutton = buttonsRow([
              {
                id: `close_ticket`,
                emoji: `🔒`,
                label: `close`,
                style: ButtonStyle.Danger,
                disabled: false,
              },
            ]);
            chat
              ?.send({ embeds: [embed], components: [closebutton] })
              .then(async (m: Message) => {
                await m.pin();
                try {
                  setTimeout(() => {
                    const num = 1;
                    chat.bulkDelete(num).catch((e: any) => {
                      return;
                    });
                  }, 1000);
                } catch {
                  return;
                }
              });
          });
        }
      }
    } else {
      interaction.reply({content: `❌ **Erro, não possuo permissões para criar canais ou enviar mensagens.**`}).catch((err) => {console.log(`Servidor: ${interaction.guild?.name}, erro:`, err)})
    }
  }
}
