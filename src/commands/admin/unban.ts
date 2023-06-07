import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { EmbedCreator } from "../../functions/functions";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  TextChannel,
} from "discord.js";
export default new Command({
  name: "unban",
  description: "De ban a um membro utilizando o comando.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "usuário",
      description: "Mencione um usuario para banir do servidor.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Digite o motivo do banimento do membro.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const userr = options.getUser("usuário");
    if (!userr) return;
    const test = await client.prisma.config.findUnique({
      where: { guild_id: interaction.guild!.id as string },
    });
    const sla = test?.logstaff as string;
    const ch = interaction.guild!.channels.cache.find(
      (c) => c.id === sla
    ) as TextChannel;
    let motivo = options.getString("motivo") || "Não informado.";
    const embederro = await EmbedCreator({
      description: `<a:errado:1084631043757310043> **Não foi possivel executar o unban.**`,
    });
    if (interaction.user?.id === userr.id) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Você não pode se desbanir.**`,
      });
      return;
    }
    if (userr.id === client.user?.id) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Eu não posso me desbanir.**`,
      });
      return;
    }
    try {
      await interaction.guild!.members.unban(userr.id, motivo);
    } catch {
      interaction.editReply({ embeds: [embederro] });
      return;
    }
    const embed = await EmbedCreator({
      description: `<:alert:1084951668648591461> **O usuário: ${userr} foi desbanido com sucesso!**\n\n<:config:1084633909020602420> **Motivo:** \`${motivo}\` \n<a:planeta:1084627835408363640> **Servidor:** \`${
        interaction.guild!.name
      }\`\n<:moderador:1065653834430546010> **Autor:** \`${
        interaction.user.username
      }\``,
    });
    await interaction.reply({ embeds: [embed] });
    if (ch) {
      ch.send({ embeds: [embed] });
    }
  },
});
