import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, Guild, GuildMember, TextChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "nickname",
  description: "[Administrador] Redefina o nome de um membro.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "nick",
      description: "Informe o novo nick do membro.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "usuário",
      description: "Selecione o usuário que deseja fazer a troca de nick.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const nick = options.getString("nick");
    const boy = options.getMember("usuário") as GuildMember
    const gid = interaction.guild as Guild;
    const embed = embeddesc(
      `<a:certo:1084630932885078036> **Nick do usuário alterado com sucesso !** \n**Nick novo:** ${nick} \n**Nick antigo:** \`${boy.user.username}\``,
      interaction
    );
    try {
      await boy.setNickname(nick)
      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Não foi possivel redefinir o nick do usuário:** ${boy.user}`, ephemeral: true
      });
    }
  },
});
