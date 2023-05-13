import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, EmbedBuilder, Guild, TextChannel } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc } from "../../functions/functions";
const prisma = new PrismaClient();

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
    const sla = await prisma.config.findUnique({ where: { guild_id: gid.id as string } })
    const stf = sla?.logstaff as string
    const chstf = gid.channels.cache.find(c => c.id === stf) as TextChannel
    const embed = embeddesc(
      `<a:certo:1084630932885078036> **Canal criado com sucesso** \n**Author:** ${interaction.user?.username}`,
      interaction
    );
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
