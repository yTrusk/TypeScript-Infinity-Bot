import { Event } from "../../configs/types/event";
import { client } from "../../main";
 export default new Event({
  name: `interactionCreate`,
  async run(interaction) {
    if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
      const event = client.infinityActions.get(interaction.customId);
      if(event){
        const findGuild = {
          where: {
            guild_id: interaction.guild?.id as string,
          },
        }
        let guild = await client.prisma.guild.findUnique(findGuild);
        const create = {
          data: {
            guild_id: interaction.guild?.id as string,
            guild_name: interaction.guild?.name,
          },
        }
        if (!guild) {
          guild = await client.prisma.guild.create(create);
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