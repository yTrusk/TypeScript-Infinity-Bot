import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder, Guild } from "discord.js";
import {
  configCreate,
  embedlogs,
  errorreport,
  handle,
  logs,
} from "../../functions/functions";
export default new Event({
  name: "inviteDelete",
  async run(invite) {
    if (invite.guild instanceof Guild) {
      const guildid = invite.guild as Guild;
      let guildConfig = await client.prisma.config.findUnique({
        where: {
          guild_id: guildid.id as string,
        },
      });
      if (!guildConfig) {
        const [user, userError] = await handle(configCreate(guildid));
        if (userError !== null) {
          await errorreport(userError);
        }
      }
      let canals = invite.guild?.channels.cache.find(
        (c) => c.id === guildConfig?.logstaff
      );
      if (!canals) {
        return;
      } else {
        const stf = guildConfig?.logstaff as string;
        const channels = client.channels.cache.get(stf) as TextChannel;
        const embed = new EmbedBuilder().setDescription(
          `**Invite deletado:** ${invite} \n`
        );
        channels.send({ embeds: [embed] });
      }
    }
  },
});
