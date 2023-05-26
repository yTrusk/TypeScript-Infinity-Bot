import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
export default new Command({
  name: "dm",
  description: "[Administrador] Envie uma mensagem por dm para um membro.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: `mensagem`,
      description: `Digite a mensagem para ser enviada ao membro.`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: `usuário`,
      description: `Selecione o usuário que deseja enviar a mensagem.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let msg = options.getString("mensagem");
    const user = options.getUser("usuário") as User;

    const servericon = interaction.guild?.iconURL();
    let embed = new EmbedBuilder()
      .setColor(`#9600D8`)
      .setDescription(`${msg}`)
      .setTitle(`Nova Mensagem!!`)
      .setTimestamp()
      .setFooter({
        text: `Servidor: ${interaction.guild?.name}`,
        iconURL: `${interaction.guild?.iconURL()}`,
      })
      .setAuthor({
        name: interaction.user?.username,
        iconURL: interaction.user?.displayAvatarURL(),
      })
      .setThumbnail(servericon || null);

    try {
      user.send({ embeds: [embed] }).then(() => {
        interaction.reply({
          content: `✅ **Mensagem enviada com sucesso para o membro:** ${user}`,
          ephemeral: true,
        });
      });
    } catch (e) {
      interaction.reply({ content: `❌ Erro`, ephemeral: true });
    }
  },
});
