import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../../configs/types/Command";
import { client } from "../../main";
import { PrismaClient } from "@prisma/client";
import { embeddesc } from "../../functions/functions";
const prisma = new PrismaClient();

export default new Command({
  name: "configpremium",
  description: "[Administrador] Configure meus modulos premiuns",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  async run({ interaction }) {
      if (!interaction.isCommand()) return;
    const user = await prisma.userProfile.findUnique({ where: { user_id: interaction.user.id } })
    
    if (user?.premium === true) {
      interaction.reply({content: `Você possui premium`})
    } else if (!user || user?.premium === false) {
      const emb = embeddesc(
        `**Você não possui premium, para comprar entre no servidor oficial abra um ticket e peça. (Pix automatico não feito para evitar dor de cabeça.)** \n**Para ver as vantagens utilize: /infopremium.**`,
        interaction
      );
      interaction.reply({embeds: [emb], ephemeral: true})
    }
  },
});
