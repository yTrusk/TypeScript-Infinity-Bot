import { Guild, GuildMember } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class VerificationClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "verification",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isButton()) return;
    await interaction.deferReply({ ephemeral: true });
    const configs = await client.prisma.config.findUnique({
      where: {
        guild_id: interaction.guild?.id,
      },
    });
    const rolex = configs?.cargoverify as string;
    const role = interaction.guild?.roles.cache.get(rolex);
    const guild = interaction.guild as Guild;
    if (!role) {
      return interaction.editReply({
        content: `<a:errado:1084631043757310043> **O servidor ainda não configurou um cargo para verificação.**`,
      });
    }
    const member = interaction.member as GuildMember;
    const botMember = guild.members.cache.find(u => u.id === client.user?.id) as GuildMember
    if (role.rawPosition >= botMember.roles.highest.position) {
      interaction.editReply({
        content: `<a:errado:1084631043757310043> **Erro, o cargo para adicionar/remover é maior ou igual ao meu.**`,
      });
    } else {
      if (member.roles.cache.has(rolex)) {
        try {
          member.roles.remove(role).then(() => {
            interaction.editReply({
              content: `<a:certo:1084630932885078036> **Você removeu seu cargo com sucesso**`,
            });
          });
        } catch {
          (err: any) => {
            interaction.editReply({
              content: `<a:errado:1084631043757310043> **Ocorreu um erro ao tentar remover o cargo. \n Erro: ${err}`,
            });
          };
        }
      } else {
        try {
          await member.roles.add(role).then(() => {
            interaction.editReply({
              content: `<a:certo:1084630932885078036> **Cargo adicionado com sucesso.**`,
            });
          });
        } catch {
          (err: any) => {
            interaction.editReply({
              content: `<a:errado:1084631043757310043> **Erro ao tentar adicionar cargo ao usuário.** \n Erro: ${err}`,
            });
          };
        }
      }
    }
  }
}
