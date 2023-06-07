import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { configModal } from "../../../functions/functions";

export default class selectConfigClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "selectticket",
      type: "selectmenu",
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isStringSelectMenu()) return;
    let op = interaction.values[0];
    if (op === "top1") {
      const modal = configModal(
        `cateticket`,
        `Categoria ticket`,
        `Envie o Id da Categoria ticket`
      );
      await interaction.showModal(modal);
    } else if (op === "top2") {
      // transcript
      const modal = configModal(
        `cateticket`,
        `Categoria ticket`,
        `Envie o Id da Categoria ticket`
      );
      await interaction.showModal(modal);
    } else if (op === "top3") {
      //cargo staff ticket
      const modal = configModal(
        `cateticket`,
        `Categoria ticket`,
        `Envie o Id da Categoria ticket`
      );
      await interaction.showModal(modal);
    }
  }
}
