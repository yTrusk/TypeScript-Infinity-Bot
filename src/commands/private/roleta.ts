import { ApplicationCommandType, Guild, User } from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  embed1,
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
  name: "roleta",
  description:
    "[Economia] Aposte 300 space coins e tenha a chance de ganhar ate 700.",
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
    if (bal < 300) {
      interaction.reply({
        content: `<a:errado:1084631043757310043>
         **Você não possui a quantidade necessaria para apostar.**`,
      });
    } else {
      const userid = interaction.user as User;
      if (!cooldowns[userid.id]) cooldowns[userid.id] = { lastCmd: null };
      let ultimoCmd = cooldowns[userid.id].lastCmd;
      let timeout = ms("20s");
      if (ultimoCmd !== null && timeout - (Date.now() - ultimoCmd) > 0) {
        let time = Math.ceil((timeout - (Date.now() - ultimoCmd)) / 1000);
        let resta = `${time} segundos`;
        if (time == 0) resta = "alguns milisegundos";
        if (time == 1) resta = "1 segundo";
        const embed_err = embed1(
          `<a:errado:1084631043757310043> Erro, roleta em cooldown!`,
          `Vagabundo querendo trapacear né? Espera \`${time}s\` para usar a roleta novamente!`
        );
        interaction.reply({ embeds: [embed_err], ephemeral: true });
        return;
      } else {
        cooldowns[userid.id].lastCmd = Date.now();
      }
      let roll = Math.ceil(Math.random() * 10);
      if (roll < 6) {
        await updateuser({
          guildid: interaction.guild?.id as string,
          userid: interaction.user?.id as string,
          dataconfig: "balance",
          newdatavalue: bal - 300,
        });
        const embed1s = embed1(
          `<a:errado:1084631043757310043> Lose`,
          `**Você perdeu** \`300\` **space coins**`
        );
        interaction.reply({ embeds: [embed1s] });
      } else {
        let roll2 = Math.ceil(Math.random() * 800);
        if (roll2 < 300) roll2 = roll2 + 300;
        await updateuser({
          guildid: interaction.guild?.id as string,
          userid: interaction.user?.id as string,
          dataconfig: "balance",
          newdatavalue: bal + roll2,
        });
        const embed1s = embed1(
          `<a:certo:1084630932885078036> Win`,
          `**Você ganhou** \`${roll2}\` **space coins**`
        );
        interaction.reply({ embeds: [embed1s] });
      }
    }
  },
});
