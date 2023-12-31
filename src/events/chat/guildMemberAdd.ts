import { Event } from "../../configs/types/event";
import { TextChannel, Role } from "discord.js";
import {
  EmbedCreator,
  errorreport,
  handle,
  userCreate,
} from "../../functions/functions";
import { client } from "../../main";
export default new Event({
  name: "guildMemberAdd",
  async run(member) {
    const configs = await client.prisma.guild.findUnique({
      where: {
        guild_id: member.guild?.id,
      },
      include: { config: true },
    });
    if (!configs) {
      const guildid = member.guild.id;
      const [user, userError] = await handle(userCreate(guildid, member.id));
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const test = configs?.config?.logsbv as string;
    const channels = member.guild?.channels.cache.get(test) as TextChannel;
    if (!channels) return;
    const embed = await EmbedCreator({
      title: `Seja Bem-Vindo(a) ${member.user.username}!`,
      description: `**Olá ${member.user.username}! Seja bem-vindo(a) ao nosso servidor ${member.guild.name}. Espero que se divirta conosco!**\n**Agora temos ${member.guild.memberCount} membros no servidor.**`,
      thumbnail: member.user.displayAvatarURL(),
    });
    await channels.send({ embeds: [embed] });
    const rolex = configs?.config?.autorole as string;
    const role = member.guild.roles.cache.find((r) => r.id === rolex) as Role;
    const ctf = configs?.config?.logstaff as string;
    const c = member.guild.channels.cache.find(
      (cs) => cs.id === ctf
    ) as TextChannel;
    if (role) {
      try {
        return member.roles.add(role);
      } catch {
        (err: any) => {
          if (err.code !== 50013 || err.status !== 403) {
            errorreport(err);
          } else {
            return c.send({
              content: `<a:errado:1084631043757310043> **Erro ao adicionar cargo ao novo usuário, verifique se o cargo que deseja setar é maior ou igual ao meu.**`,
            });
          }
        };
      }
    }
  },
});
