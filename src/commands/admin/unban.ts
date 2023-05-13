import {
      ApplicationCommandOptionType,
      ApplicationCommandType,
      Guild,
      TextChannel,
      User,
    } from "discord.js";
    import { Command } from "../../configs/types/Command";
    import { client } from "../../main";
    import { PrismaClient } from "@prisma/client";
    import { embeddesc } from "../../functions/functions";
    const prisma = new PrismaClient();

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
        const userr = options.getUser("usuário") as User;
        const gid = interaction.guild as Guild;
        const test = await prisma.config.findUnique({
          where: { guild_id: gid.id as string },
        });
        const sla = test?.logstaff as string;
        const ch = gid.channels.cache.find((c) => c.id === sla) as TextChannel;
        let motivo = options.getString("motivo") as string;
        const embederro = embeddesc(
          `<a:errado:1084631043757310043> **Não foi possivel executar o unban.**`,
          interaction
        );
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
        if (!motivo) motivo = "Não informado." as string;
        const embed = embeddesc(
          `<a:carregando:1084633391820980254> **Carregando unban...**`,
          interaction
        );
        interaction.reply({ embeds: [embed] }).then(async () => {
          if (ch) {
            try {
              await gid.members.unban(userr.id, motivo);
            } catch {
              interaction.editReply({ embeds: [embederro] });
              return;
            }
            const embed = embeddesc(
              `<:alert:1084951668648591461> **O usuário: ${userr} foi desbanido com sucesso!**\n\n<:config:1084633909020602420> **Motivo:** \`${motivo}\` \n<a:planeta:1084627835408363640> **Servidor:** \`${gid.name}\`\n<:moderador:1065653834430546010> **Autor:** \`${interaction.user.username}\``,
              interaction
            );
            await interaction.editReply({ embeds: [embed] });
            ch.send({ embeds: [embed] });
            return;
          } else {
            try {
              await gid.members.unban(userr.id, motivo);
            } catch {
              interaction.editReply({ embeds: [embederro] });
              return;
            }
            const embed = embeddesc(
              `<:alert:1084951668648591461> **O usuário: ${userr} foi desbanido com sucesso!**\n\n<:config:1084633909020602420> **Motivo:** \`${motivo}\` \n<a:planeta:1084627835408363640> **Servidor:** \`${gid.name}\`\n<:moderador:1065653834430546010> **Autor:** \`${interaction.user.username}\``,
              interaction
            );
            await interaction.editReply({ embeds: [embed] });
            return;
          }
        });
      },
    });

