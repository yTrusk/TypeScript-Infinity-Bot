import { Event } from "../../configs/types/event";
import { WebhookClient } from "discord.js";
import { embed1 } from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: "guildDelete",
  async run(guild) {
    try {
      client.prisma.guild.delete({ where: { guild_id: guild.id } });
    } catch {}
    const embed = embed1(
      `<:world:1112182741652484117> | ${guild.name} (${guild.id})`,
      `Fui removido do servidor: ${guild.name} com ${guild.memberCount} membros, totalizando ${client.guilds.cache.size} servidores e ${client.users.cache.size}.`
    );
    const ho = new WebhookClient({
      url: `https://discord.com/api/webhooks/1112053655613472850/pxRvHDHTYbeqZ3MhchXiy7TBrnhqirrhyHIem0yRjhWwegQ9Q1LkrO9iw7Ouj8Xm1Onl`,
    });
    ho.send({ embeds: [embed] });
  },
});
