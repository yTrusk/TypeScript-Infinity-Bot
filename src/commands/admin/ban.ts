import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { EmbedCreator } from "../../functions/functions";

export default new Command({
  name: "ban",
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
    const userr = options.getMember("usuário") as GuildMember;
    const test = await client.prisma.guild.findUnique({
      where: {
        guild_id: interaction.guild!.id,
      },
      include: {
        config: true,
      },
    });
    const sla = test?.config?.logstaff as string;
    const ch = sla
      ? (interaction.guild!.channels.cache.get(sla) as TextChannel)
      : null;
    const user = interaction.guild!.members.cache.get(userr.id);
    let motivo = options.getString("motivo") || "Não informado.";
    const embederro = await EmbedCreator({
      description: `<a:errado:1084631043757310043> **Não foi possivel executar o banimento, verifique se o usuário está no servidor ou tem um cargo mais alto que o meu.`,
    });
    if (
      interaction.user?.id === userr.id ||
      userr.id === client.user?.id ||
      !user
    ) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Ocorreu um erro ao obter informações de usuário.**`,
      });
      return;
    }
      try {
        await user.ban();
      } catch {
        interaction.editReply({ embeds: [embederro] });
        return;
      }
      const embed = await EmbedCreator({
        description: `<:alert:1084951668648591461> **O usuário: ${user} foi banido com sucesso!**\n\n<:config:1084633909020602420> **Motivo:** \`${motivo}\` \n<a:planeta:1084627835408363640> **Servidor:** \`${
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
