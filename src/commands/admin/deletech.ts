import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";

export default new Command({
  name: "delete-channel",
  description: "[Administrador] Delete um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
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
