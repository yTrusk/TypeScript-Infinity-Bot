import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { EmbedCreator } from "../../functions/functions";
import { client } from "../../main";
export default new Command({
  name: "clear",
  description:
    "[Administrador] Limpe um determinado numero de mensagens em um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: `quantidade`,
      description: `Selecione a quantidade de mensagens que deseja enviar.`,
      type: ApplicationCommandOptionType.Number,
      min_value: 1,
      max_value: 100,
      required: true,
    },
    {
      name: `canal`,
      description: `Selecione o canal que deseja fazer a limpeza.`,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    const q = options.getNumber("quantidade") as number;
    let c = options.getChannel("canal") as TextChannel;
    if (!c) c = interaction.channel as TextChannel;
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["ManageMessages"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente para apagar as mensagens do canal.**`,
        ephemeral: true,
      });
    }
    try {
      await c.bulkDelete(q);
      const embedfinish = await EmbedCreator({
        description: `<a:certo:1084630932885078036> **Limpeza concluída.**`,
      });
      return interaction.reply({ embeds: [embedfinish] });
    } catch (err: any) {
      const em = await EmbedCreator({
        description: `<a:errado:1084631043757310043> **Erro ao tentar limpar as mensagens do canal:** ${c}`,
      });
      return interaction.reply({ embeds: [em] });
    }
  },
});
