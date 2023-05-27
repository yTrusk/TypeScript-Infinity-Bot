import { Event } from "../../configs/types/event";
import { WebhookClient } from "discord.js";
import { createGuild, embed1 } from "../../functions/functions";
export default new Event({
  name: "guildCreate",
  async run(guild) {
    await createGuild(guild.id, guild.name);
    const embed = embed1(
      `NEW GUILD`,
      `Novo servidor: ${guild.name} (${guild.id})`
    );
    const ho = new WebhookClient({
      url: `https://discord.com/api/webhooks/1112053655613472850/pxRvHDHTYbeqZ3MhchXiy7TBrnhqirrhyHIem0yRjhWwegQ9Q1LkrO9iw7Ouj8Xm1Onl`,
    });
    ho.send({ embeds: [embed] });
  },
});
