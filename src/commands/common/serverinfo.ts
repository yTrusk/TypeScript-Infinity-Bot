import { ApplicationCommandType, ChannelType, EmbedBuilder } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default new Command({
  name: "serverinfo",
  description: "[Member] Mostra informações do servidor",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    let nome = interaction.guild?.name;
    let id = interaction.guild?.id;
    const icon = interaction.guild?.iconURL();

    let owner_id = interaction.guild?.ownerId as string;
    let owner = interaction.guild?.members.cache.get(owner_id);
    let roles = interaction.guild?.roles.cache.size;
    let boosts = interaction.guild?.premiumSubscriptionCount;

    const criação = interaction.guild?.createdAt.toLocaleDateString("pt-br");
    let membros = interaction.guild?.memberCount;

    const canais = interaction.guild?.channels.cache.size;
    const canais_texto = interaction.guild?.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText
    ).size;
    const canais_voz = interaction.guild?.channels.cache.filter(
      (c) => c.type === ChannelType.GuildVoice
    ).size;
    const canais_categoria = interaction.guild?.channels.cache.filter(
      (c) => c.type === ChannelType.GuildCategory
    ).size;

    const embed1 = new EmbedBuilder()
      .setAuthor({ name: nome as string, iconURL: icon || undefined })
      .setColor("#9600D8")
      .setThumbnail(icon || null)
      .addFields(
        {
          name: `🆔 Id Do servidor:`,
          value: `\`${id}\``,
          inline: false,
        },
        {
          name: `👑 Owner:`,
          value: ` ${owner} `,
          inline: false,
        },
        {
          name: `💎 Owner ID:`,
          value: `\`${owner_id}\``,
          inline: false,
        },
        {
          name: `👥 Membros:`,
          value: `\`${membros}\``,
          inline: false,
        },

        {
          name: `💬 Canais: \`${canais}\``,
          value: ` 📝 **Canais de texto:** \`${canais_texto}\`
      🔊 **Canais de Voz** \`${canais_voz}\``,
          inline: false,
        },
        {
          name: `📂 Total de Categorias`,
          value: `\`${canais_categoria}\``,
          inline: false,
        },
        {
          name: `📅 Servidor criado dia:`,
          value: `\`${criação}\``,
          inline: false,
        },

        {
          name: "🚀 Boosts",
          value: `\`${boosts}\``,
          inline: false,
        },
        {
          name: "🎭 Cargos",
          value: `\`${roles}\``,
          inline: false,
        }
      );
    interaction.reply({ embeds: [embed1] });
  },
});
