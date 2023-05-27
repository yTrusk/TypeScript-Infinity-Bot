import { Event } from "../../configs/types/event";
import { createGuild } from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: `interactionCreate`,
  async run(interaction) {
    if (
      interaction.isButton() ||
      interaction.isStringSelectMenu() ||
      interaction.isModalSubmit()
    ) {
      const event = client.infinityActions.get(interaction.customId);
      if (event) {
        const findGuild = {
          where: {
            guild_id: interaction.guild?.id as string,
          },
        };
        let guild = await client.prisma.guild.findUnique(findGuild);
        if (!guild) {
          guild = await createGuild(
            interaction.guild?.id,
            interaction.guild?.name
          );
        }
        event.execute({
          client,
          interaction,
          guild,
        });
      }
    }
  },
});
