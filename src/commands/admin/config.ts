import {
  ActionRowBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { PrismaClient, User } from "@prisma/client";
import {
  configCreate,
  errorreport,
  handle,
  userCreate,
} from "../../functions/functions";
const prisma = new PrismaClient();
export default new Command({
  name: "config",
  description: "[Administrador] Configure meus sistemas.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  async run({ interaction }) {
    const servericon = interaction.guild?.iconURL();

    let embedconfig = new EmbedBuilder()
      .setColor(`#9600D8`)
      .setDescription(
        `**Olá ${interaction.user.username}, aqui é o meu painel de configurações utilize-o para configurar meus comandos e os logs de comandos.** `
      )
      .setTitle(`🔮 Seja Bem-Vindo (a) ao Painel de Configurações do Infinity `)
      .setTimestamp()
      .setThumbnail(servericon || null);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("selectconfig")
        .setPlaceholder("Selecione uma categoria para configurar.")
        .addOptions([
          {
            label: "Log Staff",
            description: "Configure o canal de logs staff.",
            value: "op1",
            emoji: "<:moderador:1065653834430546010>",
          },
          {
            label: "Log Sugestões",
            description: "Configure onde será exibido as sugestões",
            value: "op2",
            emoji: "<:tabela:1084631840528281701>",
          },
          {
            label: "Ref Staff",
            description: "Configure onde será exibido as avaliações dos staffs",
            value: "op3",
            emoji: "<:mod:1066141635760640000>",
          },
          {
            label: "Sistema Anti Link",
            description: "Configure o sistema de anti link.",
            value: "op4",
            emoji: "<:cupom:1084631807502319637>",
          },
          {
            label: "Log Boas Vindas",
            description: "Configure onde será exibido as boas vindas",
            value: "op5",
            emoji: "<:cliente:1084634375997632582>",
          },
          {
            label: "Cargo verificação",
            description: "Configure o cargo de verificação.",
            value: "op6",
            emoji: "<:info:1084952883818143815>",
          },
          {
            label: "Categoria ticket",
            description: "Configure a categoria de ticket.",
            value: "op7",
            emoji: "<:pasta:1094089826661318698>",
          },
          {
            label: "Configurações",
            description: "Vejá as configurações setadas.",
            value: "op8",
            emoji: "<:config:1084633909020602420>",
          },
          {
            label: "Economia",
            description: "Configure os produtos da loja da economia.",
            value: "op9",
            emoji: "<:dinheiro:1084628513707016253>",
          },
        ])
    );
    await interaction.reply({
      embeds: [embedconfig],
      components: [row],
      ephemeral: true,
    });

    let userGuild = await prisma.user.findUnique({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guildId as string,
          user_id: interaction.user?.id as string,
        },
      },
    });
    if (!userGuild) {
      const [user, userError] = await handle<User>(
        userCreate(interaction.guild?.id, interaction.user.id)
      );
    }
    const guildid = interaction.guild?.id as string;
    let guildConfig = await prisma.guild.findUnique({
      where: {
        guild_id: guildid,
      },
      include: {
        config: true,
      },
    });
    if (!guildConfig?.config) {
      const [user, userError] = await handle(configCreate(guildid));
      if (userError === null) {
        await errorreport(user);
      } else {
        await errorreport(userError);
      }
    } else {
      return;
    }
  },
});
