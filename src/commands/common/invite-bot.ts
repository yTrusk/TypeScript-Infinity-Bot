import { ApplicationCommandType, ButtonStyle } from "discord.js";
import { Command } from "../../configs/types/Command";
import { buttonCreator } from "../../functions/functions";

export default new Command({
  name: "invite",
  description: "[Membro] me adicione a um servidor.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    const rows = buttonCreator([
      {
        url: `https://discord.com/api/oauth2/authorize?client_id=1081613624713424907&permissions=8&scope=bot`,
        label: `Invite Infinity`,
        style: ButtonStyle.Link,
      },
    ]);
    interaction.reply({
      content: `Clique [aqui](https://discord.com/api/oauth2/authorize?client_id=1081613624713424907&permissions=8&scope=bot) para **invitar o infinity** para seu servidor.`,
      components: [rows],
      ephemeral: true,
    });
  },
});
