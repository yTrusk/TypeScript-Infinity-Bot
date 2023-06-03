import { ApplicationCommandType } from "discord.js";
import { Command } from "../../configs/types/Command";
import { joinVoiceChannel } from "@discordjs/voice";
import { EmbedCreator, configCreate, errorreport, handle } from "../../functions/functions";
import { client } from "../../main";
export default new Command({
  name: "desconectar",
  description: "[Administrador] Me desconecte de um canal de voz",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  async run({ interaction }) {
    const gid = interaction.guild?.id as string;
    const xd = await client.prisma.config.findUnique({
      where: { guild_id: gid },
    });
    if (!xd) {
      const [user, userError] = await handle(configCreate(gid));
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const xds = xd?.canal_voz as string;
    const test = interaction.guild?.channels.cache.find((c) => c.id === xds);
    if (test) {
      await client.prisma.config.update({
        where: { guild_id: gid },
        data: { canal_voz: "0" },
      });
      const connection = joinVoiceChannel({
        channelId: test.id,
        guildId: test.guild.id,
        adapterCreator: test.guild.voiceAdapterCreator,
      });
      await connection.destroy();
      const em = await EmbedCreator({description: `<a:certo:1084630932885078036> **Me desconectei do canal de voz com sucesso!**`})
      interaction.reply({ embeds: [em], ephemeral: true });
    } else {
      const embed = await EmbedCreator({description: `<a:errado:1084631043757310043> **Não estou conectado a um canal de voz.**`})
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
  },
});
