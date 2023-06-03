import { ApplicationCommandType, ButtonStyle } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { EmbedCreator, buttonCreator } from "../../functions/functions";
export default new Command({
  name: "botinfo",
  description: "[Member] Vejá informaçôes sobre mim.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    let nome = client.user?.username;
    let servidores = client.guilds.cache.size;
    let ping = client.ws.ping;

    const embed = await EmbedCreator({
      title: `🌍 Vejá Minhas Informações abaixo:`,
      fields: [
        {
          name: `🤖 **Meu nome:**`,
          value: `\`${nome}\` `,
          inline: true,
        },
        {
          name: `👑 **Meu dono:**`,
          value: `<@961379624183533638> `,
          inline: true,
        },
        {
          name: ` 👻 **Quantos servers estou:**`,
          value: `\`${servidores}\` `,
          inline: true,
        },
        {
          name: `💻 **Programado em:**`,
          value: `\`TypeScript\` `,
          inline: true,
        },
        {
          name: `📚 **Minha Livraria:**`,
          value: `\`Discord.js\` `,
          inline: true,
        },
        {
          name: `🏓 **Meu ping:**`,
          value: `\`${ping}ms\` `,
          inline: true,
        },
        {
          name: `👻 **Usuários:**`,
          value: `\`${client.users.cache.size}\``,
          inline: true,
        },
      ],
    });
    const botao = buttonCreator([
      {
        style: ButtonStyle.Link,
        label: "Me convide!.",
        url: `https://discord.com/api/oauth2/authorize?client_id=1081613624713424907&permissions=8&scope=bot`,
        emoji: `🤖`,
      },
      {
        label: "Server Principal",
        emoji: `🔮`,
        url: `https://discord.gg/CH5bPQSB8r`,
        style: ButtonStyle.Link,
      },
    ]);
    interaction.reply({
      embeds: [embed],
      components: [botao],
      ephemeral: true,
    });
  },
});
