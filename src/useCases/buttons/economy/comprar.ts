import { ChannelType, TextChannel, Guild } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { PrismaClient } from "@prisma/client";
import { embeddesc } from "../../../functions/functions";
const prisma = new PrismaClient();
export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "comprarbutton",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isButton()) return;
      await interaction.deferReply({ ephemeral: true });
      const gid = interaction.guild as Guild;
      const test = await prisma.config.findUnique({
        where: { guild_id: gid.id as string },
      });
      const tests = await prisma.user.findUnique({
        where: {
          guild_id_user_id: {
            guild_id: gid.id as string,
            user_id: interaction.user.id as string,
          },
        },
      });
      const ct = tests?.preco_prod as number;
      const ctn = tests?.nome_prod as string;
      if (tests) {
        const userg = await prisma.user.findUnique({
          where: {
            guild_id_user_id: {
              user_id: interaction.user.id as string,
              guild_id: gid.id as string,
            },
          },
        });
        const bal = userg?.balance as number;
        if (bal < ct) {
          interaction.editReply({
            content: `<a:errado:1084631043757310043> **Você não possui dinheiro suficiente para comprar o produto.**`,
          });
          return;
        } else {
          await prisma.user.update({
            where: {
              guild_id_user_id: {
                user_id: interaction.user.id as string,
                guild_id: gid.id as string,
              },
            },
            data: {
              balance: bal - ct,
            },
          });
          const tests = test?.logstaff as string;
          const chs = gid.channels.cache.find(
            (c) => c.type === ChannelType.GuildText && c.id === tests
          ) as TextChannel;
          if (chs) {
            const embedsss = embeddesc(
              `<a:certo:1084630932885078036> **O usuário comprou o produto:** ${ctn} \n**User:** ${interaction.user}`,
              interaction
            );
            await interaction.editReply({
              content: `<a:certo:1084630932885078036> **Você efetuou a compra com sucesso!**`,
            });
            await chs.send({ embeds: [embedsss] });
          } else {
            await interaction.editReply({
              content: `<a:certo:1084630932885078036> **Você efetuou a compra com sucesso!** \n**Produto:** ${ctn}`,
            });
            return;
          }
        }
      }
  }
}
