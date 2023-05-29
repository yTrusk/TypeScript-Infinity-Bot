import {
  ApplicationCommandType,
  EmbedBuilder,
  Guild,
  ComponentType,
  ButtonStyle,
  TextChannel,
  ChannelType,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  SelectMenuBuilderClass,
  buttonsRow,
  embeddesc,
  handle,
  userCreate,
} from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "loja",
  description: "[Economia]",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    const message = await interaction.deferReply({ ephemeral: true });
    const gid = interaction.guild as Guild;
    let guild = await client.prisma.guild.findUnique({
      where: {
        guild_id: gid.id as string,
      },
      include: { products: true, config: true },
    });
    if (!guild) {
      guild = await client.prisma.guild.create({
        data: {
          guild_id: gid.id,
          guild_name: gid.name,
          products: {},
          dateexpires: new Date(),
          premium: false
        },
        include: {
          products: true,
          config: true
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

    const guildProducts = await client.prisma.guild.findUnique({
      where: {
        guild_id: interaction.guild?.id,
      },
      select: {
        products: true,
        config: true,
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
        const test = await client.prisma.user.findUnique({
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

        if (productToGuild) {
          const embed = new EmbedBuilder()
            .setColor(`#9600D8`)
            .setDescription(
              `${productToGuild.embeddesc}\n**Preço:** ${productToGuild.price}`
            )
            .setTitle(`${productToGuild.embedtitle}`);
          const row = buttonsRow([
            {
              id: productToGuild.id,
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
    const collectors = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1000 * 60,
    });
    collectors.on("collect", async (i): Promise<any> => {
      if (guildProducts) {
        const productToGuild = await client.prisma.products.findUnique({where: {id: i.customId}})
         const userg = await client.prisma.user.findUnique({
           where: {
             guild_id_user_id: {
               user_id: interaction.user.id as string,
               guild_id: gid.id as string,
             },
           },
         });
        const bal = userg?.balance as number;
        const prodprice = productToGuild?.price as number
         if (!userg || bal < prodprice || !bal) {
           interaction.followUp({
             content: `<a:errado:1084631043757310043> **Você não possui dinheiro suficiente para comprar o produto.**`,
           });
           return;
         } else {
           const b = productToGuild?.price as number;
           await client.prisma.user.update({
             where: {
               guild_id_user_id: {
                 user_id: interaction.user.id as string,
                 guild_id: gid.id as string,
               },
             },
             data: {
               balance: bal - b,
             },
           });
           const channelstaff = guildProducts.config?.logstaff as string;
           const chs = gid.channels.cache.find(
             (c) => c.type === ChannelType.GuildText && c.id === channelstaff
           ) as TextChannel;
           if (chs) {
             const embedsss = embeddesc(
               `<a:certo:1084630932885078036> **O usuário comprou o produto:** ${productToGuild?.name} \n**User:** ${interaction.user}`,
               interaction
             );
             await interaction.followUp({
               content: `<a:certo:1084630932885078036> **Você efetuou a compra com sucesso!**`,
             });
             await chs.send({ embeds: [embedsss] });
           } else {
             await interaction.followUp({
               content: `<a:certo:1084630932885078036> **Você efetuou a compra com sucesso!** \n**Produto:** ${productToGuild?.name}`,
             });
             return;
           }
         }
      }
    });
  },
});
