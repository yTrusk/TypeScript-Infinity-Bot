import { ButtonStyle } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import {
  buttonCreator,
  configModal,
  EmbedCreator,
  SelectMenuBuilderClass,
} from "../../../functions/functions";
export default class selectConfigClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "selectconfig",
      type: "selectmenu",
    });
  }
  async execute({ client, interaction }: actionEventProps) {
    if (!interaction.isStringSelectMenu()) return;

    let op = interaction.values[0];
    if (op === "op1") {
      const modal = configModal(
        `logstaff`,
        `Log Staff`,
        `Envie o Id do canal de Log Staff`
      );
      await interaction.showModal(modal);
    } else if (op === "op2") {
      const modal = configModal(
        `logsug`,
        `Log Sugestões`,
        `Envie o Id do canal de Log Sugestões`
      );
      await interaction.showModal(modal);
    } else if (op === "op3") {
      const modal = configModal(
        `refstaff`,
        `Ref Staff`,
        `Envie o Id do canal de Ref Staff`
      );
      await interaction.showModal(modal);
    } else if (op === "op4") {
      const modal = configModal(
        `antlkss`,
        `Sistema Anti Link`,
        `Digite "y" para ativar e "n" para desativar`
      );
      await interaction.showModal(modal);
    } else if (op === "op5") {
      const modal = configModal(
        `logbv`,
        `Log Boas Vindas`,
        `Envie o Id do canal de Log Boas Vindas`
      );
      await interaction.showModal(modal);
    } else if (op === "op6") {
      const modal = configModal(
        `cargoverify`,
        `Cargo verificação`,
        `Envie o Id do Cargo verificação`
      );
      await interaction.showModal(modal);
    } else if (op === "op7") {
      const embed = await EmbedCreator({
        description: `**Olá ${interaction.user}, sejá bem vindo (a) ao meu painel de configurações de ticket, utilize o select menu abaixo para selecionar a categoria que deseja configurar (lembre se de configurar todas para que o bot funcione corretamente).**`,
        title: `<a:planeta:1084627835408363640> | Infinity Ticket System`,
      });
      const menu = new SelectMenuBuilderClass({
        customid: `selectticket`,
        disabled: false,
      });
      menu.addMenus([
        {
          description: `Configure a categoria de ticket.`,
          label: `Categoria ticket`,
          value: "top1",
          emoji: "<:pasta:1094089826661318698>",
        },
        {
          label: `Transcript Channel`,
          description: `Configure o canal de transcript.`,
          value: "top2",
          emoji: "<:Guild_administrator_white_theme:1115758385674080337>",
        },
        {
          label: `Cargo Staff Ticket`,
          description: `Configure o cargo staff de ticket.`,
          value: "top3",
          emoji: "<:cc_post:1115759163369332757>",
        },
      ]);
      menu.updateInputs();
      interaction.reply({
        embeds: [embed],
        components: [menu.row],
        ephemeral: true,
      });
    } else if (op === "op8") {
      const configs = await client.prisma.config.findUnique({
        where: {
          guild_id: interaction.guild?.id,
        },
      });
      let test = configs?.antlk;
      if (test === "y") test = "Modulo Ativado";
      if (test === "n") test = "Modulo Desativado";
      const embed = await EmbedCreator({
        title: `<:moderador:1065653834430546010> Configurações`,
        author: [
          {
            name: interaction.user?.username,
            iconurl: interaction.user.avatarURL() || undefined,
          },
        ],
        fields: [
          {
            name: `Log Staff:`,
            value: `<#${configs?.logstaff}>`,
            inline: false,
          },
          {
            name: `Log Sugestões:`,
            value: `<#${configs?.logsugest}>`,
            inline: false,
          },
          {
            name: `Ref Staff:`,
            value: `<#${configs?.refstaff}>`,
            inline: false,
          },
          {
            name: `Sistema Anti Link:`,
            value: `${test}`,
            inline: false,
          },
          {
            name: `Logs Boas Vindas:`,
            value: `<#${configs?.logsbv}>`,
            inline: false,
          },
          {
            name: `Cargo Verificação:`,
            value: `<@&${configs?.cargoverify}>`,
            inline: false,
          },
          {
            name: `Categoria de ticket:`,
            value: `<#${configs?.cateticket}>`,
            inline: false,
          },
          {
            name: `Auto role:`,
            value: `<@&${configs?.autorole}>`,
            inline: false,
          },
        ],
      });
      interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (op === "op9") {
      const embed = await EmbedCreator({
        description: `Configure os produtos da loja.`,
      });
      const rows = buttonCreator([
        {
          id: `adicionar`,
          emoji: `➕`,
          label: `Adicionar`,
          style: ButtonStyle.Success,
          disabled: false,
        },
        {
          id: `remover`,
          emoji: `➖`,
          label: `Remover`,
          style: ButtonStyle.Danger,
          disabled: false,
        },
      ]);
      interaction.reply({
        embeds: [embed],
        components: [rows],
        ephemeral: true,
      });
    } else if (op === "op10") {
      const modal = configModal(
        `autorole`,
        `Auto Role`,
        `Envie o Id do Cargo de auto role`
      );
      await interaction.showModal(modal);
    }
  }
}
