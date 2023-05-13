import { ButtonStyle, EmbedBuilder } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { PrismaClient } from "@prisma/client";
import { buttonsRow, embeddesc } from "../../../functions/functions";
const prisma = new PrismaClient();
export default class RecusarDueloClass extends actionEvent {
  constructor(client: ExtendedClient) {
    super(client, {
      event: "aprovarsugest",
      type: "button",
      guild: {
        include: {},
      },
    });
  }
  async execute({ client, interaction }: actionEventProps) {
      if (!interaction.isButton()) return;
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
          const em = embeddesc(`🗑️ **Você retirou seu voto.**`, interaction);
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
              label: `reprovar - ${negatives} - (${reprovados.toFixed(0)}%)`,
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
  }
}
