import { PrismaClient } from '@prisma/client';
import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { TextChannel, EmbedBuilder } from "discord.js";
import { configCreate } from '../../functions/functions';
const prisma = new PrismaClient()
export default new Event({
    name: "channelCreate",
    async run(channel) {
        const guildid = channel.guild?.id as string;
        let guildConfig = await prisma.config.findUnique({
            where: {
                guild_id: guildid,
            },
        });
        if (!guildConfig) {
            await configCreate(guildid)
        }
        let canals = channel.guild?.channels.cache.find(c => c.id === guildConfig?.logstaff);
        if (!canals) {
            return;
        } else {
            const stf = guildConfig?.logstaff as string

            const channels = client.channels.cache.get(stf) as TextChannel
            const embed = new EmbedBuilder()
                .setDescription(`**Canal criado:** ${channel} \n`)
            channels.send({ embeds: [embed] })
        }
    }
})