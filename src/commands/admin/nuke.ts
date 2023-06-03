import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  TextChannel,
} from "discord.js";
import { Command } from "../../configs/types/Command";
export default new Command({
  name: "nuke",
  description:
    "[Administrador] Clone um canal e delete um canal selecionado limpando as mensagens.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja apagar e recriar.`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let c = options.getChannel("canal") as TextChannel;
    if (!c) c = interaction.channel as TextChannel;
    var posicion = c.position;
    c.clone().then(async (canal) => {
      c.delete();
      canal.setPosition(posicion);
      await canal.send({ content: `\`Canal nukado\`` });
      interaction.reply({
        content: `<a:certo:1084630932885078036> **Canal nukado com sucesso!**`,
        ephemeral: true,
      });
    });
  },
});
