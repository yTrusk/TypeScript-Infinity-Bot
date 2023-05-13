import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { configCreate} from "../../functions/functions";
const prisma = new PrismaClient()
export default new Event({
    name: "guildMemberAdd",
   async run(member) {
       const configs = await prisma.config.findUnique({
           where: {
               guild_id: member.guild?.id
           }
       })
       if (!configs) {
           const guildid = member.guild?.id
           await configCreate(guildid)
           return;
       }
       const test = configs?.logsbv as string
       const channels = member.guild?.channels.cache.get(test) as TextChannel
       if (!channels) return;
    let embed = new EmbedBuilder()
      .setColor(`#9600D8`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTitle(`Seja Bem-Vindo(a) ${member.user.username}!`)
      .setDescription(
        `**Olá ${member.user.username}! Seja bem-vindo(a) ao nosso servidor ${member.guild.name}. Espero que se divirta conosco!**\n**Agora temos ${member.guild.memberCount} membros no servidor.**`
      );
    channels.send({embeds: [embed]})
    }
})