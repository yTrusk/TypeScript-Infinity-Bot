import { Event } from "../../configs/types/event";
import { client } from "../../main";
import { Guild } from 'discord.js'

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
          //include: event.config.guild?.include
        }
        //if(findGuild.include == null) delete findGuild.include

        let guild = await client.prisma.guild.findUnique(findGuild);

        const create = {
          data: {
            guild_id: interaction.guild?.id as string,
            guild_name: interaction.guild?.name,
          },
//          include: event.config.guild?.include        
        }

  //      if(create.include == null) delete create.include
        
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