import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "aceitarduelo",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isButton()) return;
      interaction.reply({ content: `<a:certo:1084630932885078036> **Você aceitou o duelo.**` });
  }
}
