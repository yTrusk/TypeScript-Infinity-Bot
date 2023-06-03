import { ChannelType } from "discord.js";
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
      event: "cateticket",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isModalSubmit()) return;
    await interaction.deferReply({ephemeral: true})
    const id = interaction.fields.getTextInputValue("cateticket-s");
    let canals = interaction.guild?.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && c.id === id
    );
    if (!canals) {
      interaction.editReply({
        content: `<a:errado:1084631043757310043> **O id informado não existe nas categorias**`,
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
          cateticket: id,
        },
      });
      const embed = await embedlogs(`Categoria`, id, interaction.guild?.id, interaction.guild?.name);
      await logs(embed);
      interaction
        .editReply({
          content: `**Categoria setado em:** <#${id}>`,
        })
        .then(() => {
          return set;
        });
    }
  }
}
