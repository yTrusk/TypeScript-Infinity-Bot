import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder, GuildChannel } from "discord.js";
import { configCreate, errorreport, handle } from "../../functions/functions";
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
      if (userError === null) {
        await errorreport(user)
      } else {
        await errorreport(userError);
      }    }
    let canals = channels.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.logstaff
    );
    if (!canals) {
      return;
    } else {
      const stf = guildConfig?.logstaff as string;

      const channels = client.channels.cache.get(stf) as TextChannel;
      const embed = new EmbedBuilder().setDescription(
        `**Canal deletado:** ${channel} \n`
      );
      channels.send({ embeds: [embed] });
    }
  },
});
