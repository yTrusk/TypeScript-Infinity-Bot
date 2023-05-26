import { PrismaClient } from "@prisma/client";
import { client } from "../../main";
import { Event } from "../../configs/types/event";
import { PermissionFlagsBits } from "discord.js";
import { configCreate } from "../../functions/functions";
const prisma = new PrismaClient();
export default new Event({
  name: "messageCreate",
  async run(message) {
    if (message.author.id === client.user?.id) {
      return;
    }
    const guildid = message.guild?.id as string;
    let guildConfig = await prisma.config.findUnique({
      where: {
        guild_id: guildid,
      },
    });
    if (!guildConfig) {
      const set = await configCreate(guildid);
      return set;
    }
    const confirmar = guildConfig.antlk;
    if (confirmar === "y") {
      if (message.member?.permissions.has(PermissionFlagsBits.Administrator))
        return;

      const del =
        /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
      if (del.test(message.content)) {
        await message.delete();
        await message.channel.send(
          `Proibido enviar links aqui. ${message.author}`
        );
      }
    } else {
      return;
    }
  },
});
