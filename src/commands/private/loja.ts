import {
  ActionRowBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  Guild,
  StringSelectMenuBuilder,
  ComponentType,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import {
  SelectMenuBuilderClass,
  buttonsRow,
  embeddesc,
  handle,
  userCreate,
} from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "loja",
  description: "[Economia]",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
const message = await interaction.deferReply({ephemeral: true})
    const gid = interaction.guild as Guild;
    let guild = await prisma.guild.findUnique({
      where: {
        guild_id: gid.id as string,
      },
      include: { products: true },
    });
    if (!guild) {
      guild = await prisma.guild.create({
        data: {
          guild_id: gid.id,
          guild_name: gid.name,
          products: {},
        },
        include: {
          products: true,
        },
      });
    }

    if (guild.products.length <= 0)
      return interaction.editReply({
        content:
          "<a:errado:1084631043757310043> **O servidor não possui produtos.**",
      });
    const menu = new SelectMenuBuilderClass({
      customid: `teste`,
      disabled: false,
    });

    const guildProducts = await prisma.guild.findUnique({
      where: {
        guild_id: interaction.guild?.id,
      },
      select: {
        products: true,
      },
    });

    guildProducts?.products.map((product) => {
      menu.addMenus([
        {
          label: product.name,
          description: product.descprod,
          value: product.id,
        },
      ]);
    });

    const embed = new EmbedBuilder()
      .setColor(`#9600D8`)
      .setDescription(`Desc sla dps coloco`);

    menu.updateInputs();

    interaction.editReply({
      components: [menu.row],
      embeds: [embed],
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.SelectMenu,
      time: 1000 * 60,
    });

    collector.on("collect", async (i): Promise<any> => {
      if (guildProducts) {
        const productToGuild = guildProducts.products.find(
          (x) => x.id === i.values[0]
        );
        const test = await prisma.user.findUnique({
          where: {
            guild_id_user_id: {
              guild_id: gid.id as string,
              user_id: interaction.user.id as string,
            },
          },
        });
        if (!test) {
          const [user, userError] = await handle(
            userCreate(gid.id, interaction.user.id)
          );
        } 
        await prisma.user.update({
          where: { guild_id_user_id: { guild_id: gid.id as string, user_id: interaction.user.id as string } }, data: {
            nome_prod: productToGuild?.name,
            preco_prod: productToGuild?.price
        }})
          if (productToGuild) {
            const embed = new EmbedBuilder()
              .setColor(`#9600D8`)
              .setDescription(
                `${productToGuild.embeddesc}\n**Preço:** ${productToGuild.price}`
              )
              .setTitle(`${productToGuild.embedtitle}`);
            const row = buttonsRow([
              {
                id: `comprarbutton`,
                emoji: `🛒`,
                label: `Comprar`,
                style: ButtonStyle.Primary,
                disabled: false,
              },
            ]);
            await i.reply({
              embeds: [embed],
              components: [row],
              ephemeral: true,
            });
          }
        }
    });
  },
});
