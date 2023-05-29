import { Event } from "../../configs/types/event";
import { TextChannel } from "discord.js";
import {
  createGuild,
  errorreport,
  embed1,
  handle,
} from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: "guildCreate",
  async run(guild) {
    const [user, userError] = await handle(createGuild(guild.id, guild.name));
    if (userError !== null) {
      await errorreport(userError);
    }
    const embed = embed1(
      `<a:planeta:1084627835408363640> | ${guild.name} (${guild.id})`,
      `<:tabela:1084631840528281701> **Fui adicionado no servidor:** \`${guild.name}\` \n<:cliente:1084634375997632582> **Membros:** \`${guild.memberCount}.\` \n<:info:1084952883818143815> **Totalizando** \`${client.guilds.cache.size}\` **servidores e** \`${client.users.cache.size}\` **usuários.**`
    );
    const ho = client.channels.cache.find(
      (c) => c.id === "1112534964181942293"
    ) as TextChannel;
    ho.send({ embeds: [embed] });
  },
});
