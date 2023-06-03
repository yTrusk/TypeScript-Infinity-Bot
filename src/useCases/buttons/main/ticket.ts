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
import { ticket, errorreport, EmbedCreator, buttonCreator } from "../../../functions/functions";
import { client } from "../../../main";
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
    await interaction.deferReply({ ephemeral: true });
    const u = interaction.user as User;
    const gid = interaction.guild as Guild;
    const nome_canal = `🔖-${u.id}`;
    const botmember = interaction.guild?.members.cache.find(
      (user) => user.id === client.user?.id
    ) as GuildMember;
    if (botmember.permissions.has(["ManageChannels", "SendMessages"])) {
      let canal = gid.channels.cache.find((c) => c.name === nome_canal);
      if (canal) {
        interaction.editReply({
          content: `Olá **${interaction.user.username}**, você já possui um ticket em ${canal}.`,
        });
      } else {
        const sla = await client.prisma.config.findUnique({
          where: { guild_id: gid.id as string },
        });
        const slas = sla?.cateticket as string;
        const cate = gid.channels.cache.find(
          (c) => c.type === ChannelType.GuildCategory && c.id === slas
        );
        if (!cate) {
          interaction.editReply({
            content: `<a:errado:1084631043757310043> **Categoria de ticket não encontrada**`,
          });
          return;
        } else {
          await ticket(nome_canal, cate, interaction).then(async (chat) => {
            await interaction.editReply({
              content: `Olá **${interaction.user.username}**, seu ticket foi aberto em ${chat}.`,
            });
            const embed = await EmbedCreator({ title: `Ticket de: ${interaction.user.username}`, description: `**Olá ${interaction.user}, você abriu um ticket.**\n **Aguarde um momento para ser atendido por nossos staffs / moderadores, não tenha pressa e nem fique marcando a nossa equipe para que possamos ajudar a todos.**` })
            const closebutton = buttonCreator([
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
      interaction
        .reply({
          content: `<a:errado:1084631043757310043> **Erro, não possuo permissões para criar canais ou enviar mensagens.**`,
        })
        .catch(async (err) => {
          if (err !== null) {
            await errorreport(err);
          }
        });
    }
  }
}
