import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { configCreate, errorreport, handle } from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isModalSubmit()) return;
    const id = interaction.fields.getTextInputValue("cargoverify-s");
    let canals = interaction.guild?.roles.cache.find((c) => c.id === id);
    if (!canals) {
      interaction.reply({
        content: `❌ **O id informado não existem nos cargos.**`,
        ephemeral: true,
      });
    } else {
      const guildid = interaction.guild?.id as string;
      let guildConfig = await client.prisma.config.findUnique({
        where: {
          guild_id: guildid,
        },
      });
      if (!guildConfig) {
        const [user, userError] = await handle(configCreate(guildid));
        await errorreport(userError);
      }
      const set = await client.prisma.config.update({
        where: {
          guild_id: interaction.guild?.id,
        },
        data: {
          cargoverify: id,
        },
      });
      interaction
        .reply({
          content: `**Cargo de verificação setado:** <@${id}>`,
          ephemeral: true,
        })
        .then(() => {
          return set;
        });
    }
  }
}
