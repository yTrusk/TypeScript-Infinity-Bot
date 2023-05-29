import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
export default new Command({
  name: "rename-channel",
  description: "[Administrador] Troque o nome de um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["ManageChannels"],
  options: [
    {
      name: `nome`,
      description: `Digite o novo nome do canal`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: `canal`,
      description: `Selecione o canal que deseja trocar o nome.`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const name = options.getString("nome") as string;
    let c = options.getChannel("canal") as TextChannel;
    if (!c) c = interaction.channel as TextChannel;
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["Administrator"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente para trocar o nome do canal.**`,
        ephemeral: true,
      });
    }
    try {
      c.setName(name).then(() => {
        interaction.reply({
          content: `**O canal:** ${c}**, teve seu nome trocado para:** ${name}`,
          ephemeral: true,
        });
      });
    } catch {
      () => {
        interaction.reply({
          content: `<a:errado:1084631043757310043> **Erro ao tentar trocar o nome do canal, verifique se tenho as permissões necessarias.**`,
          ephemeral: true,
        });
      };
    }
  },
});
