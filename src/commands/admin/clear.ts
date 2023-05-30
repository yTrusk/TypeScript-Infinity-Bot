import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { embeddesc, errorreport } from "../../functions/functions";
import { client } from "../../main";
import { RESTJSONErrorCodes } from "discord.js";
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
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["ManageMessages"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente para apagar as mensagens do canal.**`,
        ephemeral: true,
      });
    }
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
          try {
            await c.bulkDelete(q);
            const embedfinish = embeddesc(
              `<a:certo:1084630932885078036> **Limpeza concluída.**`,
              interaction
            );
            return interaction.editReply({ embeds: [embedfinish] });
          } catch (err: any) {
            if (err.code !== 50034) {
              await errorreport(err);
            }
            const em = embeddesc(
              `<a:errado:1084631043757310043> **Erro ao tentar limpar as mensagens do canal:** ${c}`
            );
            return interaction.editReply({ embeds: [em] });
          }
        });
    }
  },
});
