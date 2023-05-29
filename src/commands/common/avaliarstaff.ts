import { ApplicationCommandOptionType, ApplicationCommandType, TextChannel, User } from "discord.js";
import { Command } from "../../configs/types/Command";
import { embed1, embeddesc } from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "avaliar-staff",
  description: "[Member] ",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `staff`,
      description: `Selecione o staff qual deseja dar a nota.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: `numero`,
      description: `De uma nota de 1 a 10 para o staff.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: `opinião`,
      description: `Digite sua opinião sobre o staff.`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const gid = interaction.guild?.id as string
    const prs = await client.prisma.config.findUnique({ where: { guild_id: gid } })
    const cst = prs?.refstaff;
    const chref = prs?.logstaff as string
    const canalsend = interaction.guild?.channels.cache.find(c => c.id === chref) as TextChannel
        const canalsend2 = interaction.guild?.channels.cache.find(
          (c) => c.id === cst
        ) as TextChannel;

    let user = options.getUser("staff") as User
    let num = options.getNumber("numero") as number;
    let op = options.getString("opinião") as String
    const embed = embed1(
      `<:Modicon:1065654040874188870> Avaliação do Staff: ${user.username}`,
      `<:moderador:1065653834430546010> **Staff:** ${user}\n<:tabela:1084631840528281701> **Nota de atendimento:** \`${num}\` \n<:cupom:1084631807502319637> **Opinião sobre atendimento:** \`\`\`${op}\`\`\` \n`
    );
    if (!canalsend2) {
      interaction.reply({ content: `<a:errado:1084631043757310043> **O canal de referencias staff não foi setado.**`, ephemeral: true })
      return;
    }
    if (num > 10 || num < 1) {
      interaction.reply({
        content: `Você não pode avaliar com mais de 10 ou menos que 1 😢 `,
        ephemeral: true,
      });
      return;
    } 
    if (!canalsend) {
      const embed1 = embeddesc(`<a:certo:1084630932885078036> **Avaliação enviada com sucesso!!**`, interaction);
      await interaction.reply({ embeds: [embed1], ephemeral: true });
        canalsend2.send({ embeds: [embed] }).catch((err: any) => {
          const embederro = embeddesc(
            `<a:errado:1084631043757310043> **Erro ao enviar avaliação. \n **Erro:** \n\n \`\`\`${err}\`\`\`**`,
            interaction
          );
          interaction.reply({ embeds: [embederro], ephemeral: true });
        });
      return;
    }else if(chref){
      const embed1 = embeddesc(
        `<a:certo:1084630932885078036> **Avaliação enviada com sucesso!!**`,
        interaction
      );
        await interaction.reply({ embeds: [embed1], ephemeral: true});
        await canalsend2.send({ embeds: [embed]   });
        await canalsend.send({ embeds: [embed]    });
         (err: any) => {
           const embederro = embeddesc(
             `<a:errado:1084631043757310043> **Erro ao enviar avaliação. \n **Erro:** \n\n \`\`\`${err}\`\`\`**`,
             interaction
           );
           interaction.reply({ embeds: [embederro] });
         };
       
    }
  },
});
