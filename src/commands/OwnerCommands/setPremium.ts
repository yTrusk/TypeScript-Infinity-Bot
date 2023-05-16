import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, User, WebhookClient } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { setPremiumExpiration } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "setpremium",
  description: "De premium a um usuário.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `tempo`,
      description: `Selecione o tempo que deseja adicionar.`,
      type: ApplicationCommandOptionType.Number,
      choices: [
        {
          name: `30d`,
          value: 30,
        },
        {
          name: `7d`,
          value: 7,
        },
          ],
      required: true
      },
      {
          name: `usuário`,
          description: `Selecione o usuário que deseja setar o premium.`,
          type: ApplicationCommandOptionType.User,
          required: true
      }
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    if (interaction.user.id != "961379624183533638") {
      interaction.reply({
        content: `Você não pode utilizar este comando.`,
        ephemeral: true,
      });
    } else {
        const user = options.getUser("usuário") as User
      const time = options.get("tempo")?.value as number;
      await setPremiumExpiration(user.id as string, time);
      
        const em = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() || undefined,
          })
          .setTimestamp()
          .setFooter({
            text: `Guild: ${interaction.guild?.name}, User: ${interaction.user.username}`,
          })
          .setDescription(
            `<a:certo:1084630932885078036> **O usuário: ${user}, teve um premium setado de: ${time}d.**\n<:info:1084952883818143815> **Aproveite suas vantagens de premium.** `
          );
        await interaction.reply({embeds: [em]})
        const ho = new WebhookClient({
          url: `https://discord.com/api/webhooks/1108173750756708403/XKmLnP2zzuvz3RwW65KHTvAHJ0VrWNADd_HQpZkirpq9NW0QK2EouVlZO1i1jdZ09wQa`,
        });
        ho.send({embeds: [em]})
    }
  },
});

