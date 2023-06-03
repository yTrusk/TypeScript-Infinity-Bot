import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel } from "discord.js";
import { EmbedCreator, configCreate, errorreport, handle } from "../../functions/functions";

export default new Event({
  name: "threadDelete",
  async run(thread) {
    const guildid = thread.guild?.id as string;
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
    let canals = thread.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.logstaff
    );
    if (!canals) {
      return;
    } else {
      const stf = guildConfig?.logstaff as string;
      const channels = client.channels.cache.get(stf) as TextChannel;
      const embed = await EmbedCreator({description: `**Thread deletada:** ${thread}`})
      channels.send({ embeds: [embed] });
    }
  },
});
