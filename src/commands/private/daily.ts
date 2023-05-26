import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../../configs/types/Command";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { User } from "discord.js";
import ms from "ms"
interface Cooldown {
  lastCmd: number | null;
}

const cooldowns: { [userId: string]: Cooldown } = {};
import { embed1, embeddesc, handle, userCreate } from "../../functions/functions";

export default new Command({
  name: "daily",
  description: "[Economia] Resgate seu premio diario de space coins.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    const userid = interaction.user as User;
    if (!cooldowns[userid.id]) cooldowns[userid.id] = { lastCmd: null };
    let ultimoCmd = cooldowns[userid.id].lastCmd;
    let timeout = ms("1 day"); // Coloque em ms o tempo
    if (ultimoCmd !== null && timeout - (Date.now() - ultimoCmd) > 0) {
      let time = Math.ceil((timeout - (Date.now() - ultimoCmd)) / 1000);
      let resta = `${time} segundos`;
      if (time == 0) resta = "alguns milisegundos";
      if (time == 1) resta = "1 segundo";
      const embed_err = embed1(
        `❌ Erro, daily já resgatado!`,
        `Vagabundo querendo trapacear né? Espera \`${time}\` para resgatar o daily novamente!`
      );
      interaction.reply({ embeds: [embed_err], ephemeral: true });
      return;
    } else {
      cooldowns[userid.id].lastCmd = Date.now();
    }
    const embed1s = embeddesc(
      `<a:carregando:1084633391820980254> **Carregando daily...**`,
      interaction
    );
    let quantia = Math.ceil(Math.random() * 2000);
    if (quantia < 500) quantia = quantia + 500;
    const resgatado = embed1(
      `<:coins:1095800360829980762> Daily Resgatado!`,
      `<:dinheiro:1084628513707016253> **Você resgatou** \`${quantia} space coins\` **em seu daily.**\n \n<:banco:1079896026124664903> **Utilize /saldo para verificar seu saldo.**`
    );
    interaction.reply({ embeds: [embed1s] }).then(async () => {
      let userGuild = await prisma.user.findUnique({
        where: {
          guild_id_user_id: {
            guild_id: interaction.guildId as string,
            user_id: userid?.id as string,
          },
        },
      });
      const bal = userGuild?.balance as number
      if (!userGuild) {
const [user, userError] = await handle(
  userCreate(interaction.guild?.id, interaction.user.id)
);      }
      await prisma.user.update({
        where: {
          guild_id_user_id: {
            guild_id: interaction.guildId as string,
            user_id: userid?.id,
          },
        },
        data: {
          balance: bal + quantia,
        },
      });
      interaction.editReply({ embeds: [resgatado] });
    });
  },
});
