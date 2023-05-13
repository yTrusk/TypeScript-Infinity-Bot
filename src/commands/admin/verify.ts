import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Guild, TextChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { buttonsRow, embed1 } from "../../functions/functions";
const prisma = new PrismaClient();

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
    const g = interaction.guild as Guild;
    const embed = embed1(
      `Verifique-se aqui!`,
      `Clique no botão abaixo para se verificar e liberar acesso ao servidor!`
    );
    const row = buttonsRow([
      {
        id: `verification`,
        emoji: `✅`,
        label: `Verifique-se`,
        disabled: false,
        style: ButtonStyle.Success,
      },
    ]);
    interaction
      .reply({
        content: `✅ **Painel de verificação enviado com sucesso!**`,
        ephemeral: true,
      })
      .then(() => {
        c.send({ embeds: [embed], components: [row] });
      });
  },
});
