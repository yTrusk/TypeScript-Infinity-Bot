import { ApplicationCommandType, Guild, User } from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  EmbedCreator,
  errorreport,
  finduser,
  handle,
  updateuser,
  userCreate,
} from "../../functions/functions";
import ms from "ms";
interface Cooldown {
  lastCmd: number | null;
}
const cooldowns: { [userId: string]: Cooldown } = {};
export default new Command({
  name: "work",
  description: "[Economia] trabalhe e ganhe uma quantidade de dinheiro.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.isCommand()) return;
    const users = interaction.user as User;
    const gid = interaction.guild as Guild;
    let userg = await finduser({
      guildid: gid.id as string,
      userid: users.id as string,
    });
    if (!userg) {
      const [user, userError] = await handle(userCreate(gid.id, users.id));
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const bal = userg?.balance as number;
    const userid = interaction.user as User;
    if (!cooldowns[userid.id]) cooldowns[userid.id] = { lastCmd: null };
    let ultimoCmd = cooldowns[userid.id].lastCmd;
    let timeout = ms("20s");
    if (ultimoCmd !== null && timeout - (Date.now() - ultimoCmd) > 0) {
      let time = Math.ceil((timeout - (Date.now() - ultimoCmd)) / 1000);
      let resta = `${time} segundos`;
      if (time == 0) resta = "alguns milisegundos";
      if (time == 1) resta = "1 segundo";
      const embed_err = await EmbedCreator({title: `<a:errado:1084631043757310043> Erro, work em cooldown!`, description: `Vagabundo querendo trapacear né? Espera \`${time}s\` para usar o work novamente!`})
      interaction.reply({ embeds: [embed_err], ephemeral: true });
      return;
    } else {
      cooldowns[userid.id].lastCmd = Date.now();
    }
    let quantia = Math.ceil(Math.random() * 3000);
    if (quantia < 500) quantia = quantia + 1000;
    await updateuser({
      guildid: interaction.guild?.id as string,
      userid: interaction.user?.id as string,
      dataconfig: "balance",
      newdatavalue: bal + quantia,
    });
    const resgatado_work = await EmbedCreator({title: `💼 Recompensa pelo serviço`, description: `<:dinheiro:1084628513707016253> **Você ganhou** \`${quantia} space coins\` **em seu trabalho.**\n \n<:banco:1079896026124664903> **Utilize /saldo para verificar seu saldo.**`})

    interaction.reply({ embeds: [resgatado_work] });
  },
});
