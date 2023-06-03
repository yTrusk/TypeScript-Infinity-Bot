import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, GuildChannel } from "discord.js";
import {
  EmbedCreator,
  configCreate,
  errorreport,
  handle,
} from "../../functions/functions";
export default new Event({
  name: "channelDelete",
  async run(channel) {
    let channels = channel as GuildChannel;
    const guildid = channels.guild?.id;
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
    let canals = channels.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.logstaff
    );
    if (!canals) {
      return;
    } else {
      const stf = guildConfig?.logstaff as string;

      const channels = client.channels.cache.get(stf) as TextChannel;
      const embed = await EmbedCreator({
        description: `**Canal deletado:** ${channel}`,
      });
      channels.send({ embeds: [embed] });
    }
  },
});
