import {
  ActionRowBuilder,
  ApplicationCommandType,
  StringSelectMenuBuilder,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { User } from "@prisma/client";
import {
  EmbedCreator,
  createGuild,
  errorreport,
  handle,
  userCreate,
} from "../../functions/functions";
import { client } from "../../main";
export default new Command({
  name: "config",
  description: "[Administrador] Configure meus sistemas.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "ManageGuild",
  async run({ interaction }) {
    const servericon = interaction.guild?.iconURL();
    const embedconfig = await EmbedCreator({description: `**Olá ${interaction.user.username}, aqui é o meu painel de configurações utilize-o para configurar meus comandos e os logs de comandos.**`, title: `🔮 Seja Bem-Vindo (a) ao Painel de Configurações do Infinity`})

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
          {
            label: "Auto role",
            description: "Configure o cargo automatico.",
            value: "op10",
            emoji: "<:alert:1084951668648591461>",
          },
        ])
    );
    await interaction.reply({
      embeds: [embedconfig],
      components: [row],
      ephemeral: true,
    });

    let userGuild = await client.prisma.user.findUnique({
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
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const guildid = interaction.guild?.id as string;
    let guildConfig = await client.prisma.guild.findUnique({
      where: {
        guild_id: guildid,
      },
      include: {
        config: true,
      },
    });
    if (!guildConfig) {
      const [user, userError] = await handle(
        createGuild(guildid, interaction.guild?.name)
      );
      if (userError !== null) {
        await errorreport(userError);
      }
    } else {
      return;
    }
  },
});
