import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  ChannelType,
  Guild,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { buttonsRow, embed1, embeddesc } from "../../functions/functions";

export default new Command({
  name: "tickets",
  description: "[Administrador] Ative o sistema de ticket no servidor.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja setar o painel de tickets`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const gid = interaction.guild as Guild;
    let canal = options.getChannel("canal") as TextChannel;
    if (!canal) canal = interaction.channel as TextChannel;
    const emt = embed1(
      `Ticket System ${gid.name}`,
      `**> Olá caso precise de ajuda ou queira fazer alguma denuncia sem nenhum outro membro saber abra um ticket** \n\n ** > Clique no botão abaixo para abrir o ticket**`
    );
    const row = buttonsRow([
      {
        id: `ticket_system`,
        label: `Abrir ticket`,
        emoji: `🎫`,
        disabled: false,
        style: ButtonStyle.Primary,
      },
    ]);
    const eph = embeddesc(
      `Olá ${interaction.user}, o sistema foi adicionado em ${canal} com sucesso.`,
      interaction
    );
    await interaction.reply({ embeds: [eph], ephemeral: true });
    canal.send({ embeds: [emt], components: [row] });
  },
});
