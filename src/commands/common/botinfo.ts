import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default new Command({
  name: "botinfo",
  description: "[Member] Vejá informaçôes sobre mim.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    let nome = client.user?.username;
    let servidores = client.guilds.cache.size;
    let ping = client.ws.ping;
    let avatar = client.user?.displayAvatarURL();

    let embed = new EmbedBuilder()

      .setColor("#9600D8")
      .setFooter({ text: "Infinity System", iconURL: avatar })
      .setTitle(` 🌍 Vejá Minhas Informações abaixo:`)
      .setThumbnail(avatar || null)
      .setFields(
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
        }
      );

    let botao = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=1081613624713424907&permissions=8&scope=bot`
        )
        .setEmoji("🤖")
        .setStyle(ButtonStyle.Link)
        .setLabel(`Me convide!.`),
      new ButtonBuilder()
        .setLabel("Server Principal")
        .setEmoji(`🔮`)
        .setURL(`https://discord.gg/JztukqVskq`)
        .setStyle(ButtonStyle.Link)
    );

    interaction.reply({
      embeds: [embed],
      components: [botao],
      ephemeral: true,
    });
  },
});
