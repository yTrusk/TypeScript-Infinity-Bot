import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import {
  configCreate,
  errorreport,
  handle,
} from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "antlkss",
      type: "modal",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isModalSubmit()) return;
    const id = interaction.fields.getTextInputValue("antlkss-s");
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
    if (id === "y") {
      const set = await client.prisma.config.update({
        where: {
          guild_id: interaction.guild?.id,
        },
        data: {
          antlk: id,
        },
      });
      interaction
        .reply({
          content: `**Modulo Ativado**`,
          ephemeral: true,
        })
        .then(() => {
          return set;
        });
    } else if (id === "n") {
      const set = await client.prisma.config.update({
        where: {
          guild_id: interaction.guild?.id,
        },
        data: {
          antlk: id,
        },
      });
      interaction
        .reply({
          content: `**Modulo Desativado**`,
          ephemeral: true,
        })
        .then(() => {
          return set;
        });
    } else {
      const set = await client.prisma.config.update({
        where: {
          guild_id: interaction.guild?.id,
        },
        data: {
          antlk: id,
        },
      });
      interaction
        .reply({
          content: `**Modulo Desativado**`,
          ephemeral: true,
        })
        .then(() => {
          return set;
        });
    }
  }
}
