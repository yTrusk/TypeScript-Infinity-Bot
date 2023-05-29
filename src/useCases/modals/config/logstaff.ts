import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import {
  configCreate,
  embedlogs,
  errorreport,
  handle,
  logs,
} from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "logstaff",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isModalSubmit()) return;
    const id = interaction.fields.getTextInputValue("logstaff-s");
    let canals = interaction.guild?.channels.cache.find((c) => c.id === id);
    if (!canals) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **O id informado não existem nos canais.**`,
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
        if (userError !== null) {
          await errorreport(userError);
        }
      }
      const set = await client.prisma.config.update({
        where: {
          guild_id: interaction.guild?.id,
        },
        data: {
          logstaff: id,
        },
      });
      const embed = embedlogs(`Log Staff`, `${id}`);
      await logs(embed);
      interaction
        .reply({
          content: `**Canal de log staff setado em:** <#${id}>`,
          ephemeral: true,
        })
        .then(() => {
          return set;
        });
    }
  }
}
