import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import ms from "ms";
import { EmbedCreator } from "../../functions/functions";

export default new Command({
  name: "mute",
  description: "[Administrador] Mute alguém por um tempo.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `usuário`,
      description: `Selecione o usuário que deseja mutar.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: `tempo`,
      description: `Selecione o tempo de mute que deseja.`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: `60s`,
          value: `60s`,
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
          name: `1h`,
          value: `1h`,
        },
        {
          name: `1d`,
          value: `1d`,
        },
        {
          name: `7d`,
          value: `7d`,
        },
      ],
    },
    {
      name: `motivo`,
      description: `Digite o motivo do castigo`,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const u = options.getMember("usuário") as GuildMember;
    let mt = options.getString("motivo");
    if (!mt) mt = "Não informado.";
    const times = options.get("tempo")?.value as string;
    const d = ms(`${times}`);
    const clientmember = interaction.guild?.members.cache.find(
      (us) => us.id === client.user?.id
    );
    if (clientmember && clientmember.permissions.has("Administrator")) {
      u.timeout(d, mt).then(async () => {
        const embed = await EmbedCreator({
          description: `**O usuário: ${u}, foi silenciado tempo: ${times}**`,
        });
        return interaction.reply({ embeds: [embed] });
      });
    } else {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Não foi possivel realizar o mute, verifique se eu possuo permissão para castigar o membro.**`,
      });
    }
  },
});
