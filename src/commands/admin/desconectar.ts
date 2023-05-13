import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, TextChannel, VoiceChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
import { joinVoiceChannel } from "@discordjs/voice";
import { configCreate, embeddesc } from "../../functions/functions";
import { PrismaClient } from "@prisma/client";
import { client } from "../../main";
const prisma = new PrismaClient();
export default new Command({
  name: "desconectar",
  description: "[Administrador] Me desconecte de um canal de voz",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  async run({ interaction, options }) {
    
      const gid = interaction.guild?.id as string;
      const xd = await prisma.config.findUnique({ where: { guild_id: gid } });
      if (!xd) {
        await configCreate(gid);
      }
      const xds = xd?.canal_voz as string;
    const test = interaction.guild?.channels.cache.find((c) => c.id === xds);
    if (test) {
      await prisma.config.update({where: { guild_id: gid}, data: {canal_voz: '0'}})
      const connection = joinVoiceChannel({
        channelId: test.id,
        guildId: test.guild.id,
        adapterCreator: test.guild.voiceAdapterCreator,
      });
      await connection.destroy();
      const em = embeddesc(
        `<a:certo:1084630932885078036> **Me desconectei do canal de voz com sucesso!**`,
        interaction
      );
      interaction.reply({embeds: [em], ephemeral: true})
    } else {
      const embed = embeddesc(
        `<a:errado:1084631043757310043> **Não estou conectado a um canal de voz.**`,
        interaction
      );
      interaction.reply({ embeds: [embed], ephemeral: true })
      return;
    }
    
  },
});