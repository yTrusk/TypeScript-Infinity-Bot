import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { configCreate, embed1, buttonsRow } from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "sugerir",
  description: "[Member] Faça uma sugestão para ajuda do servidor.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `sugestão`,
      description: `Digite sua sugestão.`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;

    let sugestao = options.getString("sugestão");
    const guildid = interaction.guild?.id as string;

    let guildConfig = await client.prisma.config.findUnique({
      where: {
        guild_id: guildid,
      },
    });
    if (!guildConfig) {
      guildConfig = await configCreate(guildid);
    }
    let canal = interaction.guild?.channels.cache.get(
      guildConfig.logsugest
    ) as TextChannel;
    const canalstaff = interaction.guild?.channels.cache.get(
      guildConfig.logstaff
    ) as TextChannel;

    if (guildConfig.logsugest === "0") {
      interaction.reply({
        content: `❌ **Erro, canal de sugestões não configurado.**`,
        ephemeral: true,
      });
    } else {
      let canals = interaction.guild?.channels.cache.find(
        (c) => c.id === guildConfig?.logsugest
      );
      if (!canals) {
        interaction.reply({
          content: `❌ **Erro, canal de sugestões não configurado.**`,
          ephemeral: true,
        });
      } else {
        const embed = embed1(
          `🚨 Nova Sugestão!`,
          `👤 **Autor:** ${interaction.user.username} (${interaction.user.id})\n🍃 **Sugestão:**
    \`\`\`${sugestao}\`\`\``
        );

        const row = buttonsRow([
          {
            id: "aprovarsugest",
            emoji: "<a:certo:1084630932885078036>",
            label: `aprovar - 0 - (0%)`,
            style: ButtonStyle.Success,
            disabled: false,
          },
          {
            id: "reprovarsugest",
            emoji: "<a:errado:1084631043757310043>",
            label: `reprovar - 0 - (0%)`,
            style: ButtonStyle.Danger,
            disabled: false,
          },
        ]);

        interaction.reply({
          content: `✅ Sua sugestão foi enviada com sucesso.`,
          ephemeral: true,
        });
        try {
          canalstaff.send({ embeds: [embed] });
        } catch {
          () => {
            interaction.reply({
              content: `Canal para sugestão não configurado.`,
              ephemeral: true,
            });
          };
        }
        const message = await canal.send({
          embeds: [embed],
          components: [row],
        });
        await client.prisma.sugestions.create({
          data: {
            message_id: message.id,
            votes: {}
          },
        });
      }
    }
  },
});
