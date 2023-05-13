import {
  EmbedBuilder,
  ButtonStyle,
  ChannelType,
  Guild,
  ButtonInteraction,
  CacheType,
  GuildBasedChannel,
  GuildMember,
  ModalBuilder,
  TextInputStyle,
  User,
  TextChannel,
  GuildChannelType,
} from "discord.js";
import { Event } from "../../configs/types/event";
import {
  configModal,
  embeddesc,
  buttonsRow,
  configCreate,
  embed1,
  inputBuilder,
  ticket,
} from "../../functions/functions";
import { PrismaClient } from "@prisma/client";
import { client } from "../../main";
const prisma = new PrismaClient();
export default new Event({
  name: `interactionCreate`,
  async run(interaction) {
    if(interaction.isButton()){
      const event = client.infinityActions.get(interaction.customId)
      if(event){
        event.execute({
          client,
          interaction
        })
      }
    }
    if(interaction.isStringSelectMenu()){
      const event = client.infinityActions.get(interaction.customId)

      if(event){
        event.execute({
          client,
          interaction
        })
      }
    }    
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "helpselect") {
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
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "logstaff") {
        const id = interaction.fields.getTextInputValue("logstaff-s");
        let canals = interaction.guild?.channels.cache.find((c) => c.id === id);
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existem nos canais.**`,
            ephemeral: true,
          });
        } else {
          const guildid = interaction.guild?.id as string;
          let guildConfig = await prisma.config.findUnique({
            where: {
              guild_id: guildid,
            },
          });
          if (!guildConfig) {
            await configCreate(guildid);
          }
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              logstaff: id,
            },
          });
          interaction
            .reply({
              content: `**Canal de log staff setado em:** <#${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "logsug") {
        const id = interaction.fields.getTextInputValue("logsug-s");
        let canals = interaction.guild?.channels.cache.find((c) => c.id === id);
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existem nos canais.**`,
            ephemeral: true,
          });
        } else {
          const guildid = interaction.guild?.id as string;
          let guildConfig = await prisma.config.findUnique({
            where: {
              guild_id: guildid,
            },
          });
          if (!guildConfig) {
            await configCreate(guildid);
          }
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              logsugest: id,
            },
          });
          interaction
            .reply({
              content: `**Canal de log sugestões setado em:** <#${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "refstaff") {
        const id = interaction.fields.getTextInputValue("refstaff-s");
        let canals = interaction.guild?.channels.cache.find((c) => c.id === id);
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existem nos canais.**`,
            ephemeral: true,
          });
        } else {
          const guildid = interaction.guild?.id as string;
          let guildConfig = await prisma.config.findUnique({
            where: {
              guild_id: guildid,
            },
          });
          if (!guildConfig) {
            await configCreate(guildid);
          }
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              refstaff: id,
            },
          });
          interaction
            .reply({
              content: `**Canal de ref staff setado em:** <#${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "antlkss") {
        const id = interaction.fields.getTextInputValue("antlkss-s");
        const guildid = interaction.guild?.id as string;
        let guildConfig = await prisma.config.findUnique({
          where: {
            guild_id: guildid,
          },
        });
        if (!guildConfig) {
          await configCreate(guildid);
        }
        if (id === "y") {
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              antlk: id,
            },
          });
          interaction
            .reply({
              content: `**Modulo Ativado**`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        } else if (id === "n") {
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              antlk: id,
            },
          });
          interaction
            .reply({
              content: `**Modulo Desativado**`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        } else {
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              antlk: id,
            },
          });
          interaction
            .reply({
              content: `**Modulo Desativado**`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "logbv") {
        const id = interaction.fields.getTextInputValue("logbv-s");
        let canals = interaction.guild?.channels.cache.find((c) => c.id === id);
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existem nos canais.**`,
            ephemeral: true,
          });
        } else {
          const guildid = interaction.guild?.id as string;
          let guildConfig = await prisma.config.findUnique({
            where: {
              guild_id: guildid,
            },
          });
          if (!guildConfig) {
            await configCreate(guildid);
          }
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              logsbv: id,
            },
          });
          interaction
            .reply({
              content: `**Canal de Bem vindos setado em:** <#${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "cargoverify") {
        const id = interaction.fields.getTextInputValue("cargoverify-s");
        let canals = interaction.guild?.roles.cache.find((c) => c.id === id);
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existem nos cargos.**`,
            ephemeral: true,
          });
        } else {
          const guildid = interaction.guild?.id as string;
          let guildConfig = await prisma.config.findUnique({
            where: {
              guild_id: guildid,
            },
          });
          if (!guildConfig) {
            await configCreate(guildid);
          }
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              cargoverify: id,
            },
          });
          interaction
            .reply({
              content: `**Cargo de verificação setado:** <@${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "cateticket") {
        const id = interaction.fields.getTextInputValue("cateticket-s");
        let canals = interaction.guild?.channels.cache.find(
          (c) => c.type === ChannelType.GuildCategory && c.id === id
        );
        if (!canals) {
          interaction.reply({
            content: `❌ **O id informado não existe nas categorias**`,
            ephemeral: true,
          });
        } else {
          const guildid = interaction.guild?.id as string;
          let guildConfig = await prisma.config.findUnique({
            where: {
              guild_id: guildid,
            },
          });
          if (!guildConfig) {
            await configCreate(guildid);
          }
          const set = await prisma.config.update({
            where: {
              guild_id: interaction.guild?.id,
            },
            data: {
              cateticket: id,
            },
          });
          interaction
            .reply({
              content: `**Categoria setado em:** <#${id}>`,
              ephemeral: true,
            })
            .then(() => {
              return set;
            });
        }
      } else if (interaction.customId === "removermodal") {
        const product_name = interaction.fields.getTextInputValue(
          "nomeremover"
        ) as string;
        const gid = interaction.guild as Guild;

        const isExistsProductName = await prisma.products.findFirst({
          where: { name: product_name },
        });
        if (isExistsProductName) {
          await prisma.products.delete({
            where: {
              id: isExistsProductName.id,
            },
          });
          interaction.reply({
            content: "produto deletado",
            ephemeral: true,
          });
          return;
        } else {
          interaction.reply({
            content: `Não foi encontrado nenhum produto com esse nome no banco de dados.`,
            ephemeral: true,
          });
          return;
        }
      } else if (interaction.customId === "adicionarmodal") {
        await interaction.deferReply({ ephemeral: true });
        const prodname = interaction.fields.getTextInputValue("nomeprod");
        const prodprec = interaction.fields.getTextInputValue("precoprod");
        const proddesc = interaction.fields.getTextInputValue("descprod");
        const title = interaction.fields.getTextInputValue("embedTitle");
        const desc = interaction.fields.getTextInputValue("descEmbed");
        const price = parseFloat(prodprec);
        if (!isNaN(price)) {
          const gid = interaction.guild as Guild;
          const guild = await prisma.guild.findUnique({
            where: { guild_id: gid.id as string },
          });

          await prisma.guild.update({
            where: {
              guild_id: gid.id as string,
            },
            data: {
              products: {
                create: {
                  name: prodname,
                  price: parseFloat(prodprec as any),
                  embeddesc: desc,
                  embedtitle: title,
                  descprod: proddesc,
                },
              },
            },
          });
          interaction.editReply({ content: `Produto criado` });
        } else {
          interaction.editReply({
            content: `O preço escolhido não é um numero valido.`,
          });
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.isButton()) {
        if (interaction.customId === "verification") {
          const configs = await prisma.config.findUnique({
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
        } else if (interaction.customId === "aceitarduelo") {
          interaction.reply({
            content: `Você aceitou o duelo.`,
            ephemeral: true,
          });
        } else if (interaction.customId === "aprovarsugest") {
          await interaction.deferReply({ ephemeral: true });

          const sugestion = await prisma.sugestions.findUnique({
            where: {
              message_id: interaction.message.id,
            },
            include: {
              votes: true,
            },
          });
          if (sugestion) {
            const userVotedInSugestion = sugestion.votes.find(
              (v) =>
                (v.user_id == interaction.user.id && v.negative != 0) ||
                v.positive != 0
            );

            if (userVotedInSugestion) {
              const getUserVoteId = sugestion.votes.find(
                (v) => v.user_id == interaction.user.id
              )?.id;
              const voteUpdate = await prisma.sugestions.update({
                where: {
                  id: sugestion.id,
                },
                data: {
                  votes: {
                    update: {
                      where: {
                        id: getUserVoteId,
                      },
                      data: {
                        positive: 0,
                      },
                    },
                  },
                },
                include: {
                  votes: true,
                },
              });
              const positives = voteUpdate.votes.filter(
                (v) => v.positive != 0
              ).length;
              const negatives = voteUpdate.votes.filter(
                (v) => v.negative != 0
              ).length;

              const somas = (positives + negatives) as number;
              const somes = 100 / somas;

              const positivePorcentage = somas / positives;
              const aprovados = somes * positives;
              const reprovados = somes * negatives;

              const row = buttonsRow([
                {
                  id: "aprovarsugest",
                  emoji: "<a:certo:1084630932885078036>",
                  label: `aprovar - ${positives} - (${
                    isNaN(aprovados) ? 0 : aprovados.toFixed(0)
                  }%)`,
                  style: ButtonStyle.Success,
                  disabled: false,
                },
                {
                  id: "reprovarsugest",
                  emoji: "<a:errado:1084631043757310043>",
                  label: `reprovar - ${negatives} - (${
                    isNaN(reprovados) ? 0 : reprovados.toFixed(0)
                  }%)`,
                  style: ButtonStyle.Danger,
                  disabled: false,
                },
              ]);
              await interaction.message.edit({ components: [row] });
              const em = embeddesc(
                `🗑️ **Você retirou seu voto.**`,
                interaction
              );
              interaction.followUp({
                ephemeral: true,
                embeds: [em], // kk
              });
            } else {
              // não votou
              const sugestionUpdated = await prisma.sugestions.update({
                where: {
                  id: sugestion.id,
                },
                data: {
                  votes: {
                    create: {
                      user_id: interaction.user.id,
                      positive: 1,
                    },
                  },
                },
                include: {
                  votes: true,
                },
              });

              const positives = sugestionUpdated.votes.filter(
                (v) => v.positive != 0
              ).length;
              const negatives = sugestionUpdated.votes.filter(
                (v) => v.negative != 0
              ).length;

              const somas = (positives + negatives) as number;
              const somes = 100 / somas;

              const positivePorcentage = somas / positives;
              const aprovados = somes * positives;
              const reprovados = somes * negatives;

              const row = buttonsRow([
                {
                  id: "aprovarsugest",
                  emoji: "<a:certo:1084630932885078036>",
                  label: `aprovar - ${positives} - (${aprovados.toFixed(0)}%)`,
                  style: ButtonStyle.Success,
                  disabled: false,
                },
                {
                  id: "reprovarsugest",
                  emoji: "<a:errado:1084631043757310043>",
                  label: `reprovar - ${negatives} - (${reprovados.toFixed(
                    0
                  )}%)`,
                  style: ButtonStyle.Danger,
                  disabled: false,
                },
              ]);
              await interaction.message.edit({ components: [row] });
              const embed = new EmbedBuilder().setDescription(
                `✅ Você aprovou essa sugestão.`
              );
              interaction.editReply({
                embeds: [embed],
              });
            }
          }
        } else if (interaction.customId === "reprovarsugest") {
          await interaction.deferReply({ ephemeral: true });

          const sugestion = await prisma.sugestions.findUnique({
            where: {
              message_id: interaction.message.id,
            },
            include: {
              votes: true,
            },
          });
          if (sugestion) {
            const userVotedInSugestion = sugestion.votes.find(
              (v) =>
                (v.user_id == interaction.user.id && v.negative != 0) ||
                v.positive != 0
            );
            if (userVotedInSugestion) {
              const getUserVoteId = sugestion.votes.find(
                (v) => v.user_id == interaction.user.id
              )?.id;
              const voteUpdate = await prisma.sugestions.update({
                where: {
                  id: sugestion.id,
                },
                data: {
                  votes: {
                    update: {
                      where: {
                        id: getUserVoteId,
                      },
                      data: {
                        negative: 0,
                      },
                    },
                  },
                },
                include: {
                  votes: true,
                },
              });
              const positives = voteUpdate.votes.filter(
                (v) => v.positive != 0
              ).length;
              const negatives = voteUpdate.votes.filter(
                (v) => v.negative != 0
              ).length;

              const somas = (positives + negatives) as number;
              const somes = 100 / somas;

              const positivePorcentage = somas / positives;
              const aprovados = somes * positives;
              const reprovados = somes * negatives;

              const row = buttonsRow([
                {
                  id: "aprovarsugest",
                  emoji: "<a:certo:1084630932885078036>",
                  label: `aprovar - ${positives} - (${
                    isNaN(aprovados) ? 0 : aprovados.toFixed(0)
                  }%)`,
                  style: ButtonStyle.Success,
                  disabled: false,
                },
                {
                  id: "reprovarsugest",
                  emoji: "<a:errado:1084631043757310043>",
                  label: `reprovar - ${negatives} - (${
                    isNaN(reprovados) ? 0 : reprovados.toFixed(0)
                  }%)`,
                  style: ButtonStyle.Danger,
                  disabled: false,
                },
              ]);
              await interaction.message.edit({ components: [row] });

              const em = embeddesc(
                `🗑️ **Você retirou seu voto.**`,
                interaction
              );
              interaction.followUp({
                ephemeral: true,
                embeds: [em], // kk
              });
            } else {
              // não votou
              const sugestionUpdated = await prisma.sugestions.update({
                where: {
                  id: sugestion.id,
                },
                data: {
                  votes: {
                    create: {
                      user_id: interaction.user.id,
                      negative: 1,
                    },
                  },
                },
                include: {
                  votes: true,
                },
              });

              const positives = sugestionUpdated.votes.filter(
                (v) => v.positive != 0
              ).length;
              const negatives = sugestionUpdated.votes.filter(
                (v) => v.negative != 0
              ).length;

              const somas = (positives + negatives) as number;
              const somes = 100 / somas;

              const positivePorcentage = somas / positives;
              const aprovados = somes * positives;
              const reprovados = somes * negatives;

              const row = buttonsRow([
                {
                  id: "aprovarsugest",
                  emoji: "<a:certo:1084630932885078036>",
                  label: `aprovar - ${positives} - (${aprovados.toFixed(0)}%)`,
                  style: ButtonStyle.Success,
                  disabled: false,
                },
                {
                  id: "reprovarsugest",
                  emoji: "<a:errado:1084631043757310043>",
                  label: `reprovar - ${negatives} - (${reprovados.toFixed(
                    0
                  )}%)`,
                  style: ButtonStyle.Danger,
                  disabled: false,
                },
              ]);
              await interaction.message.edit({ components: [row] });
              const embed = new EmbedBuilder().setDescription(
                `❌ **Você reprovou essa sugestão.**`
              );
              interaction.editReply({
                embeds: [embed],
              });
            }
          }
        } else if (interaction.customId === "ticket_system") {
          const u = interaction.user as User;
          const gid = interaction.guild as Guild;
          const nome_canal = `🔖-${u.id}`;
          let canal = gid.channels.cache.find((c) => c.name === nome_canal);
          if (canal) {
            interaction.reply({
              content: `Olá **${interaction.user.username}**, você já possui um ticket em ${canal}.`,
              ephemeral: true,
            });
          } else {
            const sla = await prisma.config.findUnique({
              where: { guild_id: gid.id as string },
            });
            const slas = sla?.cateticket as string;
            const cate = gid.channels.cache.find(
              (c) => c.type === ChannelType.GuildCategory && c.id === slas
            );
            if (!cate) {
              interaction.reply({
                content: `<a:errado:1084631043757310043> **Categoria de ticket não encontrada**`,
                ephemeral: true,
              });
              return;
            } else {
              await ticket(nome_canal, cate, interaction).then(async (chat) => {
                await interaction.reply({
                  content: `Olá **${interaction.user.username}**, seu ticket foi aberto em ${chat}.`,
                  ephemeral: true,
                });
                const embed = embed1(
                  `Ticket de: ${interaction.user.username}`,
                  `**Olá ${interaction.user}, você abriu um ticket.**\n **Aguarde um momento para ser atendido por nossos staffs / moderadores, não tenha pressa e nem fique marcando a nossa equipe para que possamos ajudar a todos.**`
                );
                const closebutton = buttonsRow([
                  {
                    id: `close_ticket`,
                    emoji: `🔒`,
                    label: `close`,
                    style: ButtonStyle.Danger,
                    disabled: false,
                  },
                ]);
                chat
                  ?.send({ embeds: [embed], components: [closebutton] })
                  .then(async (m) => {
                    await m.pin();
                    try {
                      setTimeout(() => {
                        const num = 1;
                        chat.bulkDelete(num).catch((e: any) => {
                          return;
                        });
                      }, 1000);
                    } catch {
                      return;
                    }
                  });
              });
            }
          }
        } else if (interaction.customId === "close_ticket") {
          interaction.reply({
            content: `Olá ${interaction.user}, este ticket será excluído em 5 segundos.`,
          });
          try {
            setTimeout(() => {
              interaction.channel?.delete().catch((e) => {
                return;
              });
            }, 5000);
          } catch (e) {
            return;
          }
        } else if (interaction.customId === "adicionar") {
          const modal = new ModalBuilder()
            .setCustomId(`adicionarmodal`)
            .setTitle(`Modal de Adição de Produtos`);

          const inputs = inputBuilder([
            {
              input_id: `nomeprod`,
              input_label: `Envie o nome do produto.`,
              input_style: TextInputStyle.Short,
            },
            {
              input_id: `precoprod`,
              input_label: `Envie o preço do produto.`,
              input_style: TextInputStyle.Short,
            },
            {
              input_id: `descprod`,
              input_label: `Envie a descrição do produto.`,
              input_style: TextInputStyle.Short,
            },
            {
              input_id: `embedTitle`,
              input_label: `Envie o titulo da embed do produto.`,
              input_style: TextInputStyle.Short,
            },
            {
              input_id: `descEmbed`,
              input_label: `Envie a descrição da embed do produto.`,
                input_style: TextInputStyle.Paragraph,
                input_maxleng: 100
            },
          ]);
          modal.addComponents(inputs);
          interaction.showModal(modal);
        } else if (interaction.customId === "remover") {
          //aq ja n sei pensei em algo legal hm
          const modal = new ModalBuilder()
            .setCustomId(`removermodal`)
            .setTitle(`Remova produtos da loja`);
          const inputs = inputBuilder([
            {
              input_id: `nomeremover`,
              input_label: `Envie o nome do produto que deseja remover.`,
              input_style: TextInputStyle.Short,
            },
          ]);
          modal.addComponents(inputs);
          interaction.showModal(modal);
        } else if (interaction.customId === "comprarbutton") {
          await interaction.deferReply({ephemeral: true})
          const gid = interaction.guild as Guild;
          const test = await prisma.config.findUnique({
            where: { guild_id: gid.id as string },
          });
            const tests = await prisma.user.findUnique({ where: { guild_id_user_id: { guild_id: gid.id as string, user_id: interaction.user.id as string } } })
            const ct = tests?.preco_prod as number
            const ctn = tests?.nome_prod as string
          if (tests) {
            const userg = await prisma.user.findUnique({
              where: {
                guild_id_user_id: {
                  user_id: interaction.user.id as string,
                  guild_id: gid.id as string,
                },
              },
            });
            const bal = userg?.balance as number;
              if (bal < ct) {
              interaction.editReply({
                content: `<a:errado:1084631043757310043> **Você não possui dinheiro suficiente para comprar o produto.**`,
              });
              return;
            } else {
              await prisma.user.update({
                where: {
                  guild_id_user_id: {
                    user_id: interaction.user.id as string,
                    guild_id: gid.id as string,
                  },
                },
                data: {
                  balance: bal - ct,
                },
              });
              const tests = test?.logstaff as string;
                const chs = gid.channels.cache.find((c) => c.type === ChannelType.GuildText && c.id === tests) as TextChannel
              if (chs) {
                const embedsss = embeddesc(
                  `<a:certo:1084630932885078036> **O usuário comprou o produto:** ${ctn} \n**User:** ${interaction.user}`,
                  interaction
                );
                await interaction.editReply({
                  content: `<a:certo:1084630932885078036> **Você efetuou a compra com sucesso!**`,
                });
                await chs.send({ embeds: [embedsss] });
              } else {
                await interaction.editReply({
                  content: `<a:certo:1084630932885078036> **Você efetuou a compra com sucesso!** \n**Produto:** ${ctn}`,
                });
                return;
              }
            }
          }
        }
      }
    }
  },
});
