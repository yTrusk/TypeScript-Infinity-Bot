import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  VoiceChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { joinVoiceChannel } from "@discordjs/voice";
import { PrismaClient } from "@prisma/client";
import { configCreate, embeddesc } from "../../functions/functions";
const prisma = new PrismaClient();
export default new Command({
  name: "conectar",
  description: "[Administrador] Me conecte a um canal de voz",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: `canal`,
      description: `Selecione o canal de voz que deseja me conectar.`,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildVoice],
      required: true,
    },
  ],
  async run({ interaction, options }) {
    const channel = options.getChannel("canal") as VoiceChannel;
    if (!(channel instanceof VoiceChannel)) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> Erro você não selecionou um canal de voz.`,
        ephemeral: true,
      });
    } else {
      const gid = interaction.guild?.id as string;
      const xd = await prisma.config.findUnique({ where: { guild_id: gid } });
      if (!xd) {
        await configCreate(gid);
      }
      const xds = xd?.canal_voz as string;
      const test = interaction.guild?.channels.cache.find(
        (c) => c.id === xds
      ) as VoiceChannel;
      if (test) {
        const embed = embeddesc(
          `<a:errado:1084631043757310043> **Já estou conectado a um canal de voz utilize /desconectar**`,
          interaction
        );
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      } else if (!test || xd?.canal_voz === "0") {
        await prisma.config.update({
          where: { guild_id: gid },
          data: { canal_voz: channel.id as string },
        });
        const connection = await joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const em = embeddesc(
          `<a:certo:1084630932885078036> **Me conectei com sucesso ao canal !**`,
          interaction
        );
        interaction
          .reply({
            embeds: [em],
            ephemeral: true,
          })
          .then(() => {
            return connection;
          })
          .catch((err) => {
            interaction.reply({
              content: `<a:errado:1084631043757310043> **Ocorreu um erro ao tentar se conectar com o canal de voz Erro:** \n${err}`,
              ephemeral: true,
            });
          });
        return;
      }
    }
  },
});
