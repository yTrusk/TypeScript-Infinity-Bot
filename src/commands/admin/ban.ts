import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  Guild,
  GuildMember,
  TextChannel,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc, embed1 } from "../../functions/functions";
const prisma = new PrismaClient();

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
    const userr = options.getUser("usuário") as User;
    const gid = interaction.guild as Guild;
     const guildid = interaction.guild?.id as string;
        const test = await prisma.guild.findUnique({
          where: {
            guild_id: guildid,
          },
          include: {
            config: true,
          },
        });
    const sla = test?.config?.logstaff as string;
    const ch = gid.channels.cache.find((c) => c.id === sla) as TextChannel;
    const user = gid.members.cache.get(userr.id) as GuildMember;
    const member = gid.members.cache.get(user.id);
    let motivo = options.getString("motivo") as string;
    const embederro = embeddesc(
      `<a:errado:1084631043757310043> **Não foi possivel executar o banimento, verifique se o usuário está no servidor ou tem um cargo mais alto que o meu.**`,
      interaction
    );
    if (interaction.user?.id === userr.id) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Você não pode se banir.**`,
      });
      return;
    }
    if (userr.id === client.user?.id) {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Eu não posso me banir.**`,
      });
      return;
    }
    if (!motivo) motivo = "Não informado." as string;
    const embed = embeddesc(
      `<a:carregando:1084633391820980254> **Carregando banimento...**`,
      interaction
    );
    interaction.reply({ embeds: [embed] }).then(async () => {
      if (ch) {
        try {
          await user.ban();
        } catch {
          interaction.editReply({ embeds: [embederro] });
          return;
        }
        const embed = embeddesc(
          `<:alert:1084951668648591461> **O usuário: ${user} foi banido com sucesso!**\n\n<:config:1084633909020602420> **Motivo:** \`${motivo}\` \n<a:planeta:1084627835408363640> **Servidor:** \`${gid.name}\`\n<:moderador:1065653834430546010> **Autor:** \`${interaction.user.username}\``,
          interaction
        );
        await interaction.editReply({ embeds: [embed] });
        ch.send({ embeds: [embed] });
        return;
      } else {
        try {
          await user.ban();
        } catch {
          interaction.editReply({ embeds: [embederro] });
          return;
        }
        const embed = embeddesc(
          `<:alert:1084951668648591461> **O usuário: ${user} foi banido com sucesso!**\n\n<:config:1084633909020602420> **Motivo:** \`${motivo}\` \n<a:planeta:1084627835408363640> **Servidor:** \`${gid.name}\`\n<:moderador:1065653834430546010> **Autor:** \`${interaction.user.username}\``,
          interaction
        );
        await interaction.editReply({ embeds: [embed] });
        return;
      }
    });
  },
});
