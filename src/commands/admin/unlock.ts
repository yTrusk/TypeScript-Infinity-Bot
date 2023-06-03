import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { EmbedCreator } from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "unlock",
  description: "[Administrador] Desbloqueie um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja desbloquear.`,
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
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["Administrator"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente.**`,
        ephemeral: true,
      });
    }
    if (!chst) {
      await ch.permissionOverwrites.edit(gid.id as string, {
        SendMessages: true,
      });
      const emb = await EmbedCreator({description: `<a:certo:1084630932885078036> **Canal destrancado com sucesso! **`})
      interaction.reply({ embeds: [emb], ephemeral: true }).then(async () => {
        const emb2 = await EmbedCreator({description: `🔒 **Este canal foi destrancado pelo adm: ${interaction.user}.**`})
        ch.send({ embeds: [emb2] });
      });
    } else {
      await ch.permissionOverwrites.edit(gid.id as string, {
        SendMessages: true,
      });
      const emb = await EmbedCreator({description: `<a:certo:1084630932885078036> **Canal destrancado com sucesso!** \n<:info:1084952883818143815> **Canal:** ${ch} \n<:moderador:1065653834430546010> **Adm: ${interaction.user}**`})
      interaction.reply({ embeds: [emb], ephemeral: true }).then(async () => {
        const emb2 = await EmbedCreator({description: `🔓 **Este canal foi destrancado pelo adm: ${interaction.user}.**`})
        await ch.send({ embeds: [emb2] });
        chst.send({ embeds: [emb] });
      });
    }
  },
});
