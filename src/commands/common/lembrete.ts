import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../../configs/types/Command";
export default new Command({
  name: "lembrete",
  description:
    "[Member] Sejá mencionado por mim pelo tempo que definir (em segundos).",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `tempo`,
      description: `Envie o tempo que deseja que eu te mencione.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const time = options.getNumber("tempo") as number;
    if (time > 1200) {
      return interaction.reply({
        content: `**Você não pode colocar mais que 20 minutos.**`,
        ephemeral: true,
      });
    }
    interaction
      .reply({
        content: `${interaction.user}, irei te marcar daqui: ${time}s`,
      })
      .then(() => {
        setTimeout(() => {
          interaction.followUp({
            content: `${interaction.user} o tempo de: ${time}s acabou.`,
          });
        }, time * 1000);
      });
  },
});
