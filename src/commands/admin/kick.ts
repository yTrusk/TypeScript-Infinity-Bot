import { ApplicationCommandOptionType, ApplicationCommandType, Guild, GuildMember, TextChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
import { PrismaClient } from "@prisma/client";
import { embeddesc } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "kick",
  description: "[Administrador] Expulse um membro utilizando o comando.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "usuário",
      description: "Mencione um usuario para expulsar do servidor.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Digite o motivo da expulsão do membro.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const gid = interaction.guild as Guild
    const sla = await prisma.config.findUnique({ where: { guild_id: gid.id as string } })
    const member = options.getMember(`usuário`) as GuildMember
    let motivo = options.getString("motivo") 
    if (!motivo) motivo = "Não informado.";
    const stf = sla?.logstaff as string
    const chstf = gid.channels.cache.find(c => c.id === stf) as TextChannel
      const embed = embeddesc(
        `<a:certo:1084630932885078036> **O usuario: ${member} foi expulso com sucesso!**\n\n **Motivo:** \`${motivo}\` \n **Servidor:** \`${gid.name}\``,
        interaction
      );
    const embederro = embeddesc(
      `<a:errado:1084631043757310043> **Não foi possivel executar o kick, verifique se o usuário está no servidor ou tem um cargo mais alto que o meu.**`,
      interaction
    );
    if (chstf) {
      try {
        await member.kick()
      } catch {
        interaction.reply({ embeds: [embederro], ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [embed] })
      chstf.send({ embeds: [embed] })
      return;
    } else {
      try {
        await member.kick();
      } catch {
        interaction.reply({ embeds: [embederro], ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [embed] });
      return;
    }
  },
});
