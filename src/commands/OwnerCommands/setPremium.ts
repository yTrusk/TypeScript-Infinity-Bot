import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  WebhookClient,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { setPremiumExpiration } from "../../functions/functions";
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
      required: true,
    },
    {
      name: `servidor`,
      description: `Selecione o usuário que deseja setar o premium.`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    if (interaction.user.id != "961379624183533638") {
      interaction.reply({
        content: `Você não pode utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      const servidor = options.getString("servidor") as string;
      const time = options.get("tempo")?.value as number;
      await setPremiumExpiration(servidor as string, time);
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
          `<a:certo:1084630932885078036> **O servidor: ${servidor}, teve um premium setado de: ${time}d.**\n<:info:1084952883818143815> **Aproveite suas vantagens de premium.** `
        );
      await interaction.reply({ embeds: [em] });
      const ho = new WebhookClient({
        url: `https://discord.com/api/webhooks/1112053655613472850/pxRvHDHTYbeqZ3MhchXiy7TBrnhqirrhyHIem0yRjhWwegQ9Q1LkrO9iw7Ouj8Xm1Onl`,
      });
      ho.send({ embeds: [em] });
    }
  },
});
