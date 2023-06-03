import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, Guild, GuildMember, TextChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
import { EmbedCreator } from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "clone",
  description: "[Administrador] Cria um canal e recria com as mesmas config.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: `canal`,
      description: `Selecione o canal que deseja clonar.`,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
      required: false
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let ch = options.getChannel("canal") as TextChannel
    if(!ch) ch = interaction.channel as TextChannel
    const gid = interaction.guild as Guild
    const sla = await client.prisma.config.findUnique({ where: { guild_id: gid.id as string } })
    const stf = sla?.logstaff as string
    const chstf = gid.channels.cache.find(c => c.id === stf) as TextChannel
    const embed = await EmbedCreator({description: `<a:certo:1084630932885078036> **Canal criado com sucesso** \n**Author:** ${interaction.user?.username}`})
    let clientmember = interaction.guild?.members.cache.find(
      (u) => u.id === client.user?.id
    ) as GuildMember;
    if (!clientmember.permissions.has(["ManageChannels"])) {
      return interaction.reply({
        content: `<a:errado:1084631043757310043> **Erro, não possuo permissão suficiente para criar um canal.**`,
        ephemeral: true,
      });
    }
    if (chstf) {
      var posicion = ch.position
      ch.clone().then(async (canal) => {
        canal.setPosition(posicion)
        
        await interaction.reply({
          content: `<a:certo:1084630932885078036> **Canal criado com sucesso**`,
          ephemeral: true,
        });
        await canal.send({ embeds: [embed] })
        chstf.send({embeds: [embed]})
      })
    } else {
       var posicion = ch.position;
       ch.clone().then(async (canal) => {
         canal.setPosition(posicion);

         await interaction.reply({
           content: `<a:certo:1084630932885078036> **Canal criado com sucesso**`,
           ephemeral: true,
         });
        canal.send({ embeds: [embed] });
       });
    }
  },
});
