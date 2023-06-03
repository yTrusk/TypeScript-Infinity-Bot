import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { embed1, logs } from "../../../functions/functions";
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
    await interaction.deferReply({ ephemeral: true });
    const product_name = interaction.fields.getTextInputValue(
      "nomeremover"
    ) as string;
    const isExistsProductName = await client.prisma.products.findFirst({
      where: { name: product_name },
    });
    if (isExistsProductName) {
      await client.prisma.products.delete({
        where: {
          id: isExistsProductName.id,
        },
      });
      const embed = embed1(
        `<a:planeta:1084627835408363640> - Produto criado (Economia)`,
        `<:tabela:1084631840528281701> **- Nome do produto:** \`${isExistsProductName.name}\` \n<:dinheiro:1084628513707016253> **- Preço do produto:** \`${isExistsProductName.price}\` `
      );
      await logs(embed);
      interaction.editReply({
        content: "produto deletado",
      });
      return;
    } else {
      interaction.editReply({
        content: `Não foi encontrado nenhum produto com esse nome no banco de dados.`,
      });
      return;
    }
  }
}
