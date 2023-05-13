import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "close_ticket",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isButton()) return;
      interaction.reply({
        content: `Olá ${interaction.user}, este ticket será excluído em 5 segundos.`,
      });
      try {
        setTimeout(() => {
          interaction.channel?.delete().catch((e) => {
            return;
          });
        }, 5000);
      } catch (e) {
        return;
      }
  }
}
