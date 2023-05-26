import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
export default new Command({
  name: "say",
  description: "[Administrador] Comando de fala.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: `titulo`,
      description: `Digite um titulo para a embed.`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: `descrição`,
      description: `Digite uma descrição para a embed.`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: `canal`,
      description: `Selecione o canal que deseja que a mensagem seja enviada.`,
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: `imagem`,
      description: `Envie o link de uma imagem para a embed.`,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    const title = options.getString("titulo");
    const desc = options.getString("descrição");
    const ch = options.getChannel("canal") as TextChannel;
    const img = options.getString("imagem");
    if (ch === null) return;
    if (!img) {
      const embed1 = new EmbedBuilder()
        .setColor(`#fc0808`)
        .setDescription(desc)
        .setTitle(title);
      interaction.reply({
        content: `✅ Sua mensagem foi enviada com sucesso!`,
        ephemeral: true,
      });
      await ch.send({ embeds: [embed1] });
    } else {
      const embed2 = new EmbedBuilder()
        .setColor(`#fc0808`)
        .setDescription(desc)
        .setTitle(title)
        .setImage(img);
      interaction.reply({
        content: `✅ Sua mensagem foi enviada com sucesso!`,
        ephemeral: true,
      });
      await ch.send({ embeds: [embed2] });
    }
  },
});
