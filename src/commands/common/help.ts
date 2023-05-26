import { ActionRowBuilder, ApplicationCommandType, StringSelectMenuBuilder } from "discord.js";
import { Command } from "../../configs/types/Command";
import { embed1 } from "../../functions/functions";

export default new Command({
  name: "help",
  description: "[Member] Exibe meus comandos!",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    const embed = embed1(
      `📕 Menu de Ajuda`,
      `**Olá sejá bem vindo (a) ao meu menu de ajuda, aqui você encotrara todos os meus comandos apenas selecionando a categoria que deseja ver, caso deseja me adicionar utilize /botinfo.**`
    );
    const selecthelp = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("helpselect")
        .setPlaceholder("Selecione uma categoria.")
        .addOptions(
          {
            label: "Comandos Staff",
            description: "Vejá os comandos de adm",
            value: "h1",
            emoji: "<:moderador:1065653834430546010>",
          },
          {
            label: "Comandos Economia",
            description: "Vejá os comandos da economia.",
            value: "h2",
            emoji: "<:coins:1095800360829980762>",
          },
          {
            label: "Comandos utilitarios",
            description: "Vejá os comandos uteis para membros.",
            value: "h3",
            emoji: "<:cliente:1084634375997632582>",
          }
        )
    );
    interaction.reply({
      embeds: [embed],
      components: [selecthelp],
      ephemeral: true,
    });
  },
});
