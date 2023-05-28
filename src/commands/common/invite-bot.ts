import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Command } from "../../configs/types/Command";

export default new Command({
  name: "invite",
  description: "[Membro] me adicione a um servidor.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;

    const rows = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=1081613624713424907&permissions=8&scope=bot`
        )
        .setLabel(`Invite Infinity`)
        .setStyle(ButtonStyle.Link)
    );
    interaction.reply({
      content: `Clique [aqui](https://discord.com/api/oauth2/authorize?client_id=1081613624713424907&permissions=8&scope=bot) para **invitar o infinity** para seu servidor.`,
      components: [rows],
      ephemeral: true,
    });
  },
});
