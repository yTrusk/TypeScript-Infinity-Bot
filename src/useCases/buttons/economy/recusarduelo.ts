import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "recusarduelo",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ interaction }: actionEventProps) {
    if (!interaction.isButton()) return;
    interaction.reply({
      content: `<a:errado:1084631043757310043> **Você recusou o duelo.**`,
      ephemeral: true,
    });
  }
}
