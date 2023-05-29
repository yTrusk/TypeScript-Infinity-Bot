import { Guild } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import {
  createGuild,
  embed1,
  errorreport,
  handle,
  logs,
} from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "adicionarmodal",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isModalSubmit()) return;
    await interaction.deferReply({ ephemeral: true });
    const prodname = interaction.fields.getTextInputValue("nomeprod");
    const prodprec = interaction.fields.getTextInputValue("precoprod");
    const proddesc = interaction.fields.getTextInputValue("descprod");
    const title = interaction.fields.getTextInputValue("embedTitle");
    const desc = interaction.fields.getTextInputValue("descEmbed");
    const price = parseFloat(prodprec);
    if (!isNaN(price)) {
      const gid = interaction.guild as Guild;
      const guild = await client.prisma.guild.findUnique({
        where: { guild_id: gid.id as string },
      });
      if (!guild) {
        const [user, userError] = await handle(
          createGuild(interaction.guild?.id, interaction.guild?.name)
        );
        if (userError !== null) {
          await errorreport(userError);
        }
      }
      await client.prisma.guild.update({
        where: {
          guild_id: gid.id as string,
        },
        data: {
          products: {
            create: {
              name: prodname,
              price: parseFloat(prodprec as any),
              embeddesc: desc,
              embedtitle: title,
              descprod: proddesc,
            },
          },
        },
      });
      const embed = embed1(
        `<a:planeta:1084627835408363640> - Produto criado (Economia)`,
        `<:tabela:1084631840528281701> **- Nome do produto:** \`${prodname}\` \n<:dinheiro:1084628513707016253> **- Preço do produto:** \`${price}\` `
      );
      await logs(embed)
      interaction.editReply({ content: `Produto criado` });
    } else {
      interaction.editReply({
        content: `O preço escolhido não é um numero valido.`,
      });
    }
  }
}
