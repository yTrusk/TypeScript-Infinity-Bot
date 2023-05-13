import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { embeddesc } from "../../functions/functions";

export default new Command({
  name: "clear",
  description:
    "[Administrador] Limpe um determinado numero de mensagens em um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: `quantidade`,
      description: `Selecione a quantidade de mensagens que deseja enviar.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: `canal`,
      description: `Selecione o canal que deseja fazer a limpeza.`,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    const q = options.getNumber("quantidade");
    let c = options.getChannel("canal") as TextChannel;
    if (q === null) return;
    if (!c) c = interaction.channel as TextChannel;
    if (q > 100) {
      interaction.reply({
        content: `Você não pode apagar mais de 100 mensagens por vez.`,
      });
    } else if (q < 1) {
      interaction.reply({
        content: `Você não pode apagar menos que 1 mensagem por vez.`,
      });
    } else {
      const embedfazendo = embeddesc(
        `<:config:1084633909020602420> **Preparando a limpeza...**`,
        interaction
      );
      interaction
        .reply({ embeds: [embedfazendo], ephemeral: true })
        .then(async () => {
          await c.bulkDelete(q);
          const embedfinish = embeddesc(
            `<a:certo:1084630932885078036> **Limpeza concluida.**`,
            interaction
          );
          interaction.editReply({ embeds: [embedfinish] });
        });
    }
  },
});
