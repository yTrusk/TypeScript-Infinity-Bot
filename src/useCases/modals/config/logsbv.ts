import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { configCreate } from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "logbv",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isModalSubmit()) return;
      const id = interaction.fields.getTextInputValue("logbv-s");
        let canals = interaction.guild?.channels.cache.find((c) => c.id === id);
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existem nos canais.**`,
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
            await configCreate(guildid);
          }
          const set = await client.prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              logsbv: id,
            },
          });
          interaction
            .reply({
              content: `**Canal de Bem vindos setado em:** <#${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } 
}
