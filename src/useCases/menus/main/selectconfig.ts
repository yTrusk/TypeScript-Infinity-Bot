import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class RecusarDueloClass extends actionEvent {
    constructor(client: ExtendedClient){
        super(client, {
            event: 'selectconfig',
            type: 'button'
        })
   }
   async execute({ client, interaction }: actionEventProps){
        if(!interaction.isStringSelectMenu()) return;

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
          const modal = configModal(
            `cateticket`,
            `Categoria ticket`,
            `Envie o Id da Categoria ticket`
          );
          await interaction.showModal(modal);
        } else if (op === "op8") {
          const configs = await prisma.config.findUnique({
            where: {
              guild_id: interaction.guild?.id,
            },
          });
          let test = configs?.antlk;
          if (test === "y") test = "Modulo Ativado";
          if (test === "n") test = "Modulo Desativado";
          const embed = new EmbedBuilder()
            .setColor(`#9600D8`)
            .setTitle(`<:moderador:1065653834430546010> Configurações`)
            .setAuthor({
              name: interaction.user?.username,
              iconURL: interaction.user.avatarURL() || undefined,
            })
            .setFields(
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
              }
            );
          interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (op === "op9") {
          const embed = embeddesc(
            `Configure os produtos da loja.`,
            interaction
          );
          const rows = buttonsRow([
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
        }
   }
}