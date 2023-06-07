import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  ChannelType,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { EmbedCreator, buttonCreator } from "../../functions/functions";

export default new Command({
  name: "verify-role",
  description:
    "[Administrador] Use este comando para setar um painel de verificação.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja setar o painel de verificação.`,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let c = options.getChannel("canal") as TextChannel;
    if (!c) c = interaction.channel as TextChannel;
    const embed = await EmbedCreator({
      title: `Verifique-se aqui!`,
      description: `Clique no botão abaixo para se verificar e liberar acesso ao servidor!`,
    });
    const row = buttonCreator([
      {
        id: `verification`,
        emoji: `<a:certo:1084630932885078036>`,
        label: `Verifique-se`,
        style: ButtonStyle.Success,
      },
    ]);

    await interaction.reply({
      content: `<a:certo:1084630932885078036> **Painel de verificação enviado com sucesso!**`,
      ephemeral: true,
    });
    c.send({ embeds: [embed], components: [row] });
  },
});
