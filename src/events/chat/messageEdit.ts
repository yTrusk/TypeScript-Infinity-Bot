import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder } from "discord.js";
import { configCreate } from "../../functions/functions";

export default new Event({
  name: "messageUpdate",
  async run(message) {
    if (message.author?.id === client.user?.id) return;
    const guildid = message.guild?.id as string;
    let guildConfig = await client.prisma.config.findUnique({
      where: {
        guild_id: guildid,
      },
    });
    if (!guildConfig) {
      await configCreate(guildid);
    }
    let canals = message.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.logstaff
    );
    if (!canals) {
      return;
    } else {
      const stf = guildConfig?.logstaff as string;
      const channels = client.channels.cache.get(stf) as TextChannel;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author?.tag || "Usuário não informado.",
          iconURL: message.author?.avatarURL() || undefined,
        })
        .setDescription(
          `**📝 Mensagem de texto editada. \nMensagem editada:** \`\`\`${message}\`\`\``
        );
      await channels.send({ embeds: [embed] });
    }
  },
});
