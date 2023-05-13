import { Guild, GuildMember } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class VerificationClass extends actionEvent {
    constructor(client: ExtendedClient) {
        super(client, {
          event: "verification",
          type: "button",
          guild: {
            include : {},
          },
        });
    }
    async execute({ client, interaction }: actionEventProps) {
        if (!interaction.isButton()) return;
        const configs = await client.prisma.config.findUnique({
          where: {
            guild_id: interaction.guild?.id,
          },
        });
        const rolex = configs?.cargoverify as string;
        const role = interaction.guild?.roles.cache.get(rolex);
        const guild = interaction.guild as Guild;
        if (!role) return;
        const member = interaction.member as GuildMember;
        const botMember = await guild.members.fetch(client.user!.id);

        if (role.rawPosition >= botMember.roles.highest.position) {
          interaction.reply({
            content: `❌ **Erro, o cargo para adicionar/remover é maior ou igual ao meu.**`,
            ephemeral: true,
          });
        } else {
          if (member.roles.cache.has(rolex)) {
            try {
              member.roles.remove(role).then(() => {
                interaction.reply({
                  content: `✅ **Você removeu seu cargo com sucesso**`,
                  ephemeral: true,
                });
              });
            } catch {
              (err: any) => {
                interaction.reply({
                  content: `❌ **Ocorreu um erro ao tentar remover o cargo. \n Erro: ${err}`,
                  ephemeral: true,
                });
              };
            }
          } else {
            try {
              await member.roles.add(role).then(() => {
                interaction.reply({
                  content: `✅ **Cargo adicionado com sucesso.**`,
                  ephemeral: true,
                });
              });
            } catch {
              (err: any) => {
                interaction.reply({
                  content: `❌ **Erro ao tentar adicionar cargo ao usuário.** \n Erro: ${err}`,
                  ephemeral: true,
                });
              };
            }
          }
        }
       
    }
}