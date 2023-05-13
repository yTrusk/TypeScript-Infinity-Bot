import { ModalBuilder, TextInputStyle } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { PrismaClient } from "@prisma/client";
import { inputBuilder } from "../../../functions/functions";
const prisma = new PrismaClient();
export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "adicionar",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isButton()) return;
      const modal = new ModalBuilder()
        .setCustomId(`adicionarmodal`)
        .setTitle(`Modal de Adição de Produtos`);

      const inputs = inputBuilder([
        {
          input_id: `nomeprod`,
          input_label: `Envie o nome do produto.`,
          input_style: TextInputStyle.Short,
        },
        {
          input_id: `precoprod`,
          input_label: `Envie o preço do produto.`,
          input_style: TextInputStyle.Short,
        },
        {
          input_id: `descprod`,
          input_label: `Envie a descrição do produto.`,
          input_style: TextInputStyle.Short,
        },
        {
          input_id: `embedTitle`,
          input_label: `Envie o titulo da embed do produto.`,
          input_style: TextInputStyle.Short,
        },
        {
          input_id: `descEmbed`,
          input_label: `Envie a descrição da embed do produto.`,
          input_style: TextInputStyle.Paragraph,
          input_maxleng: 100,
        },
      ]);
      modal.addComponents(inputs);
      interaction.showModal(modal);
  }
}
