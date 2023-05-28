import { EmbedBuilder } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class selectConfigClass extends actionEvent {
    constructor(client: ExtendedClient) {
        super(client, {
          event: "helpselect",
          type: "selectmenu",
        });
    }
    async execute({ client, interaction, guild }: actionEventProps) {
        if (!interaction.isStringSelectMenu()) return;

        console.log("guild", guild)
       let opcions = interaction.values[0];
       if (opcions === "h1") {
         let embed_comands_staff = new EmbedBuilder()
           .setColor(`#9600D8`)
           .setTitle(`🛠 Comandos Staff`)
           .addFields(
             {
               name: `📌 |   /config`,
               value: `\`Configure o bot nas opções de logs etc.\``,
               inline: false,
             },

             {
               name: `📌 |    /kick`,
               value: `\`Expulse um membro utilizando o comando.\``,
               inline: false,
             },
             {
               name: `📌 |    /lock`,
               value: `\`Bloqueie um canal de texto.\``,
               inline: false,
             },
             {
               name: `📌 |    /unlock`,
               value: `\`Selecione o canal que deseja desbloquear.\``,
               inline: false,
             },
             {
               name: `📌 |    /nuke`,
               value: `\`Cria um canal e recria com as mesmas config.\``,
               inline: false,
             },
             {
               name: `📌 |    /criarembed`,
               value: `\`Crie uma embed para utilizar usando modal.\``,
               inline: false,
             },
             {
               name: `📌 |    /say`,
               value: `\`Utilize o comando para o bot executar uma fala\``,
               inline: false,
             },
             {
               name: `📌 |    /ban `,
               value: `\`De ban a um membro utilizando o comando.\``,
               inline: false,
             },
             {
               name: `📌 |    /unban `,
               value: `\`De unban a um membro utilizando o comando.\``,
               inline: false,
             },
             {
               name: `📌 |   /clone`,
               value: `\`Cria um canal com as mesmas config.\``,
               inline: false,
             },
             {
               name: `📌 |   /dm`,
               value: `\`Envie uma mensagem por dm para um membro.\``,
               inline: false,
             },
             {
               name: `📌 |   /nickname`,
               value: `\`Redefina o nome de um usuário.\``,
               inline: false,
             },
             {
               name: `📌 |   /slowmode`,
               value: `\`Utilize o comando para deixar o chat mais devagar.\``,
               inline: false,
             },
             {
               name: `📌 |   /clear`,
               value: `\`Limpe uma quantidade de mensagens em determinado canal.\``,
               inline: false,
             }
           );
         interaction.reply({
           embeds: [embed_comands_staff],
           ephemeral: true,
         });
       } else if (opcions === "h2") {
         let embedecom = new EmbedBuilder()
           .setColor(`#9600D8`)
           .setTitle(`💼 Comandos Economia`)
           .addFields(
             {
               name: `📌 |   /roleta`,
               value: `\`Gire em uma roleta e aposte 300 caso ganhe tem a chance de ganhar de 100 a 500 space coins.\``,
               inline: false,
             },
             {
               name: `📌 |   /daily`,
               value: `\`Resgate seu premio diario de space coins.\``,
               inline: false,
             },
             {
               name: `📌 |   /pay`,
               value: `\`transfira uma quantidade de dinheiro para um usuário.\``,
               inline: false,
             },
             {
               name: `📌 |   /saldo`,
               value: `\`Verifique seu saldo de space coins.\``,
               inline: false,
             },
             {
               name: `📌 |   /work`,
               value: `\`Ganhe space coins trabalhando.\``,
               inline: false,
             },
             {
               name: `📌 |   /double`,
               value: `\`Utilize o comando para fazer apostas com a quantidade que deseja com uma dificuldade de 50% de chance de ganhar e dobrar a quantidade apostada ou perder a quantidade apostada.\``,
               inline: false,
             },
             {
               name: `📌 |   /duelo`,
               value: `\`Duele com seus amigos e tenha a chance de ganhar a grana deles.\``,
               inline: false,
             },
             {
               name: `📌 |   /loja`,
               value: `\`Vejá o menu de coisas para comprar com space coins.\``,
               inline: false,
             }
           );
         interaction.reply({ embeds: [embedecom], ephemeral: true });
       } else if (opcions === "h3") {
         let embed_comands_utilitarios = new EmbedBuilder()
           .setColor(`#9600D8`)
           .setTitle(`🔥 Comandos Utilitarios`)
           .addFields(
             {
               name: `📌 |   /botinfo `,
               value: `\`Vejá informaçôes sobre mim.\``,
               inline: false,
             },
             {
               name: `📌 |   /help `,
               value: `\`Exibe meus comandos!\``,
               inline: false,
             },
             {
               name: `📌 |   /ping `,
               value: `\`Exibe meu ping em ms.\``,
               inline: false,
             },
             {
               name: `📌 |   /serverinfo `,
               value: `\`Mostra informações do servidor.\``,
               inline: false,
             },
             {
               name: `📌 |   /sugerir `,
               value: `\`Faça uma sugestão para ajuda do servidor.\``,
               inline: false,
             },
             {
               name: `📌 |   /userinfo `,
               value: `\`Veja informações de um usuário.\``,
               inline: false,
             },
             {
               name: `📌 |   /avatar-guild`,
               value: `\`Exibe a foto do servidor.\``,
               inline: false,
             },
             {
               name: `📌 |   /avaliar-staff`,
               value: `\`avalie um staff com nota de atendimento etc.\``,
               inline: false,
             },
             {
               name: `📌 |   /invites`,
               value: `\`Veja quantos invites você possui ou os de um usuário.\``,
               inline: false,
             }
           );
         interaction.reply({
           embeds: [embed_comands_utilitarios],
           ephemeral: true,
         });
       }
    }
}