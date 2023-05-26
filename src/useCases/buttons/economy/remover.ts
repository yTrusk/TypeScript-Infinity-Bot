import { ModalBuilder, TextInputStyle } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { inputBuilder } from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "remover",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ interaction }: actionEventProps) {
    if (!interaction.isButton()) return;
    const modal = new ModalBuilder()
      .setCustomId(`removermodal`)
      .setTitle(`Remova produtos da loja`);
    const inputs = inputBuilder([
      {
        input_id: `nomeremover`,
        input_label: `Envie o nome do produto que deseja remover.`,
        input_style: TextInputStyle.Short,
      },
    ]);
    modal.addComponents(inputs);
    interaction.showModal(modal);
  }
}
