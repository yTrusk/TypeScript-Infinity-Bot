import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder, Guild } from "discord.js";
import { PrismaClient } from '@prisma/client';
import { configCreate } from "../../functions/functions";
const prisma = new PrismaClient()

export default new Event({
    name: "roleDelete",
    async run(role) {
        if (role instanceof Guild) {
    const guildid = role.guild?.id as string;
    let guildConfig = await prisma.config.findUnique({
      where: {
        guild_id: guildid,
      },
    });
    if (!guildConfig) {
      await configCreate(guildid);
    }
    let canals = role.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.logstaff
    );
    if (!canals) {
      return;
    } else {
      const stf = guildConfig?.logstaff as string
      const channels = client.channels.cache.get(stf) as TextChannel;
      const embed = new EmbedBuilder().setDescription(
        `**🔮 Novo Cargo deletado.`
      );
      await channels.send({ embeds: [embed] });
    }
    }
    }
})