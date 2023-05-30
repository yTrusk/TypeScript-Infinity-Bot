import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder, Role } from "discord.js";
import {
  configCreate,
  errorreport,
  handle,
} from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: "guildMemberAdd",
  async run(member) {
    const configs = await client.prisma.config.findUnique({
      where: {
        guild_id: member.guild?.id,
      },
    });
    if (!configs) {
      const guildid = member.guild.id;
      const [user, userError] = await handle(configCreate(guildid));
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const test = configs?.logsbv as string;
    const channels = member.guild?.channels.cache.get(test) as TextChannel;
    if (!channels) return;
    let embed = new EmbedBuilder()
      .setColor(`#9600D8`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTitle(`Seja Bem-Vindo(a) ${member.user.username}!`)
      .setDescription(
        `**Olá ${member.user.username}! Seja bem-vindo(a) ao nosso servidor ${member.guild.name}. Espero que se divirta conosco!**\n**Agora temos ${member.guild.memberCount} membros no servidor.**`
      );
    channels.send({ embeds: [embed] }).then(async () => {
      const role = configs?.autorole as string
      const realrole = member.guild.roles.cache.find(c => c.id === role) as Role
      if (realrole) {
        return member.roles.add(realrole)
      } else {
        return;
      }
    })
  },
});
