//trocar nome de canal
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
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
          content: `❌ **Erro ao tentar trocar o nome do canal, verifique se tenho as permissões necessarias.**`,
          ephemeral: true,
        });
      };
    }
  },
});
