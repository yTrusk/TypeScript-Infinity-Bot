import { PrismaClient } from "@prisma/client";
import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder, GuildChannel } from "discord.js";
import { configCreate } from "../../functions/functions";
const prisma = new PrismaClient();
export default new Event({
  name: "channelDelete",
    async run(channel) {
      let channels = channel as GuildChannel
    const guildid = channels.guild?.id
    let guildConfig = await prisma.config.findUnique({
      where: {
        guild_id: guildid,
      },
    });
    if (!guildConfig) {
      await configCreate(guildid);
    }
    let canals = channels.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.logstaff 
    );
    if (!canals) {
      return;
    } else {
      const stf = guildConfig?.logstaff as string

      const channels = client.channels.cache.get(stf) as TextChannel;
      const embed = new EmbedBuilder().setDescription(
        `**Canal deletado:** ${channel} \n`
      );
      channels.send({ embeds: [embed] });
    }
  },
});
