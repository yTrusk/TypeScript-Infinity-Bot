import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  Guild,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { embeddesc } from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "lock",
  description: "[Administrador] Bloqueie um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja bloquear`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let ch = options.getChannel("canal") as TextChannel;
    if (!ch) ch = interaction.channel as TextChannel;
    const gid = interaction.guild as Guild;
    const sla = await client.prisma.config.findUnique({
      where: { guild_id: gid.id as string },
    });
    const st = sla?.logstaff as string;
    const chst = gid.channels.cache.find((c) => c.id === st) as TextChannel;
    if (!chst) {
      await ch.permissionOverwrites.edit(gid.id as string, {
        SendMessages: false,
      });
      const emb = embeddesc(
        `<a:certo:1084630932885078036> **Canal trancado com sucesso! **`,
        interaction
      );
      interaction.reply({ embeds: [emb] }).then(() => {
        const emb2 = embeddesc(
          `🔒 **Este canal foi trancado pelo adm: ${interaction.user}.**`,
          interaction
        );
        ch.send({ embeds: [emb2] });
      });
    } else {
      await ch.permissionOverwrites.edit(gid.id as string, {
        SendMessages: false,
      });
      const emb = embeddesc(
        `<a:certo:1084630932885078036> **Canal trancado com sucesso!** \n<:info:1084952883818143815> **Canal:** ${ch} \n<:moderador:1065653834430546010> **Adm: ${interaction.user}**`,
        interaction
      );
      interaction.reply({ embeds: [emb] }).then(async () => {
        const emb2 = embeddesc(
          `🔒 **Este canal foi trancado pelo adm: ${interaction.user}.**`,
          interaction
        );
        await ch.send({ embeds: [emb2] });
        chst.send({ embeds: [emb] });
      });
    }
  },
});
