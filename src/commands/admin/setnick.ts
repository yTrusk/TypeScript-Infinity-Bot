import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { embeddesc } from "../../functions/functions";
import { client } from "../../main";

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
    const boy = options.getMember("usuário") as GuildMember;
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["ManageNicknames"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente.**`,
        ephemeral: true,
      });
    }
    const embed = embeddesc(
      `<a:certo:1084630932885078036> **Nick do usuário alterado com sucesso !** \n**Nick novo:** ${nick} \n**Nick antigo:** \`${boy.user.username}\``,
      interaction
    );
    try {
      await boy.setNickname(nick);
      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply({
        content: `<a:errado:1084631043757310043> **Não foi possivel redefinir o nick do usuário:** ${boy.user}`,
        ephemeral: true,
      });
    }
  },
});
