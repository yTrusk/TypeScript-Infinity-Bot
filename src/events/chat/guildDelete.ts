import { Event } from "../../configs/types/event";
import { TextChannel } from "discord.js";
import { errorreport, embed1, handle } from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: "guildDelete",
  async run(guild) {
    const [user, userError] = await handle(
      client.prisma.guild.delete({ where: { guild_id: guild.id } })
    );
    if (userError === null) {
      await errorreport(user);
    } else {
      await errorreport(userError);
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
