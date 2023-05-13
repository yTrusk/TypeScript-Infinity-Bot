import { Guild } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "removermodal",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isModalSubmit()) return;
      const product_name = interaction.fields.getTextInputValue(
        "nomeremover"
      ) as string;
      const gid = interaction.guild as Guild;

      const isExistsProductName = await client.prisma.products.findFirst({
        where: { name: product_name },
      });
      if (isExistsProductName) {
        await client.prisma.products.delete({
          where: {
            id: isExistsProductName.id,
          },
        });
        interaction.reply({
          content: "produto deletado",
          ephemeral: true,
        });
        return;
      } else {
        interaction.reply({
          content: `Não foi encontrado nenhum produto com esse nome no banco de dados.`,
          ephemeral: true,
        });
        return;
      }
  }
}
