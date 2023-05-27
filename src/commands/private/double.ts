import { ApplicationCommandOptionType, ApplicationCommandType, Guild, User } from "discord.js";
import { Command } from "../../configs/types/Command";
import { embed1, embeddesc, finduser, handle, updateuser, userCreate } from "../../functions/functions";
import ms from "ms";
interface Cooldown {
  lastCmd: number | null;
}

const cooldowns: { [userId: string]: Cooldown } = {};
export default new Command({
  name: "double",
  description: "[Economia] ",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Digite a quantidade que deseja apostar no double.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    const users = interaction.user as User
    const gid = interaction.guild as Guild
    const q = options.getNumber("quantidade") as number
    let userg = await finduser({ guildid: gid.id as string, userid: users.id as string})
    if (!userg) {
      const [user, userError] = await handle(userCreate(gid.id, users.id));
    }
    const bal = userg?.balance as number
    if (q < 10) {
      interaction.reply({ content: `<a:errado:1084631043757310043> **Você não pode apostar menos que 10.**`, ephemeral: true });
    } else {
      if (bal < q) {
        interaction.reply({
          content: `<a:errado:1084631043757310043>
         **Você não pode apostar mais do que possui.**`})
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
            `❌ Erro, daily já resgatado!`,
            `Vagabundo querendo trapacear né? Espera \`${time}s\` para resgatar o daily novamente!`
          );
          interaction.reply({ embeds: [embed_err], ephemeral: true });
          return;
        } else {
          cooldowns[userid.id].lastCmd = Date.now();
        }
            const embed1s = embeddesc(
              `<a:carregando:1084633391820980254> **Realizando aposta...**`,
              interaction
        );
        await interaction.reply({embeds: [embed1s]})
                  let quantia = Math.ceil(Math.random() * 10);
        if (quantia < 6) {
          await updateuser({guildid: gid.id as string, userid: users.id as string, dataconfig: "balance", newdatavalue: bal - q})
          const embedlose = embed1(
            `<a:errado:1084631043757310043> Lose`,
            `**Você perdeu** \`${q}\``
          );
          await interaction.editReply({ embeds: [embedlose] })
          users.send({embeds: [embedlose]})
        } else {
          const q2 = q * 2;
          await updateuser({guildid: gid.id as string, userid: users.id as string, dataconfig: "balance", newdatavalue: bal + q2})
            const embedwin = embed1(
              `<a:certo:1084630932885078036> Win`,
              `**Você ganhou** \`${q2}\``
            );
          await interaction.editReply({ embeds: [embedwin] });
          users.send({ embeds: [embedwin] });
              }
      }
    }
  },
});
