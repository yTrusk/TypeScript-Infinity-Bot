import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import ms from "ms";
import { client } from "../../main";
export default new Command({
  name: "slowmode",
  description:
    "[Administrador] Utilize o comando para deixar o chat mais devagar.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `tempo`,
      description: `Selecione o tempo que deseja deixar o chat lento.`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: `5s`,
          value: "5s",
        },
        {
          name: `10s`,
          value: `10s`,
        },
        {
          name: `15s`,
          value: `15s`,
        },
        {
          name: `30s`,
          value: `30s`,
        },
        {
          name: `1m`,
          value: `1m`,
        },
        {
          name: `2m`,
          value: `2m`,
        },
        {
          name: `5m`,
          value: `5m`,
        },
        {
          name: `10m`,
          value: `10m`,
        },
        {
          name: `15m`,
          value: `5s`,
        },
        {
          name: `30m`,
          value: `30m`,
        },
        {
          name: `1h`,
          value: `1h`,
        },
        {
          name: `2h`,
          value: `2h`,
        },
        {
          name: `6h`,
          value: `6h`,
        },
      ],
    },
    {
      name: `canal`,
      description: `Selecione o canal que deseja deixar lento`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let times = options.get("tempo")?.value as string;
    let canal = options.getChannel("canal") as TextChannel;
    if (!canal) canal = interaction.channel as TextChannel;
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["ManageChannels"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente.**`,
        ephemeral: true,
      });
    }
    let d = ms(`${times}`);
    try {
      canal.setRateLimitPerUser(d / 1000)
      interaction.reply({
        content: `<a:certo:1084630932885078036> **Cooldown do canal definido para:** \`${times}\``,});
    } catch {
    }
  },
});
