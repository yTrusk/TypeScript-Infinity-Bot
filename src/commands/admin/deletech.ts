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
  name: "delete-channel",
  description: "[Administrador] Delete um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["ManageChannels"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja deletar.`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let c = options.getChannel("canal") as TextChannel;
    if (!c) c = interaction.channel as TextChannel;
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["Administrator"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente para apagar as mensagens do canal.**`,
        ephemeral: true,
      });
    }
    interaction
      .reply({
        content: `**O canal: ${c}, será deletado em 5 segundos.**`,
        ephemeral: true,
      })
      .then(() => {
        setTimeout(() => {
          c.delete();
        }, 5000);
      });
  },
});
