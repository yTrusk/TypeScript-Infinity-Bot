import { Event } from "../../configs/types/event";
import { TextChannel } from "discord.js";
import { createguilderror, embed1 } from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: "guildDelete",
  async run(guild) {
    try {
      client.prisma.guild.delete({ where: { guild_id: guild.id } });
    } catch {
      async (err: any) => {
        const embeds = await createguilderror(err);
        ho.send({ embeds: [embeds] });
      };
    }
    const embed = embed1(
      `<a:planeta:1084627835408363640> | ${guild.name} (${guild.id})`,
      `<:tabela:1084631840528281701> **Fui removido do servidor:** \`${guild.name}\` \n<:cliente:1084634375997632582> **Membros:** \`${guild.memberCount}.\` \n<:info:1084952883818143815> **Totalizando** \`${client.guilds.cache.size}\` **servidores e** \`${client.users.cache.size}\` **usuários.**`
    );
    const ho = client.channels.cache.find(
      (c) => c.id === "1100184382309924966"
    ) as TextChannel;
    ho.send({ embeds: [embed] });
  },
});
