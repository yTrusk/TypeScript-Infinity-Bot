import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { PermissionFlagsBits, TextChannel } from "discord.js";
export default new Event({
  name: "messageCreate",
  async run(message) {
    if (message.author.id === client.user?.id && message.author.bot === true) {
      return;
    }
    const guildid = message.guild?.id as string;
    let guildConfig = await client.prisma.config.findUnique({
      where: {
        guild_id: guildid,
      },
    });
    const confirmar = guildConfig?.antlk;
    if (confirmar === "y") {
      if (message.member?.permissions.has(PermissionFlagsBits.Administrator))
        return;
      const del =
        /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
      if (del.test(message.content)) {
        await message.delete();
        await message.member?.timeout(60000, "links div");
        await message.channel.send(
          `Proibido enviar links aqui. ${message.author}`
        );
        const gstf = guildConfig?.logstaff;
        const c = message.guild?.channels.cache.find(
          (cs) => cs.id === gstf
        ) as TextChannel;
        if (c) {
          c.send({
            content: `**O usuário: ${message.author}, foi castigado por 60s por enviar links.**`,
          });
        }
      }
    } else {
      return;
    }
  },
});
