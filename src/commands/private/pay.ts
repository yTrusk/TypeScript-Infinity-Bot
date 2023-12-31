import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Guild,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  EmbedCreator,
  errorreport,
  finduser,
  updateuser,
  userCreate,
} from "../../functions/functions";

export default new Command({
  name: "pay",
  description: "[Economy]",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Selecione o usuário que deseja pagar.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: `quantidade`,
      description: `Digite a quantidade que você deseja enviar para o usuário.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({});
    let userr = options.getUser("usuário") as User;
    if (userr.id != interaction.user.id) {
      const quantidade = options.getNumber("quantidade") as number;
      let user = interaction.user;
      const gid = interaction.guild as Guild;
      const userrBalances = await finduser({
        guildid: gid.id as string,
        userid: userr.id as string,
      });
      const userBalances = await finduser({
        guildid: gid.id as string,
        userid: user.id as string,
      });
      if (!userrBalances) {
        try {
          await userCreate(gid.id as string, userr.id as string);
        } catch {
          async (userError: any) => {
            if (userError !== null) {
              await errorreport(userError);
            }
          };
        }
      }
      if (!userBalances) {
        try {
          await userCreate(gid.id as string, user.id as string);
        } catch {
          async (userError: any) => {
            if (userError !== null) {
              await errorreport(userError);
            }
          };
        }
      }
      let user1balance = userrBalances?.balance as number;
      const user2balance = userBalances?.balance as number;
      if (quantidade < 1) {
        interaction.editReply({ content: `você não pode doar menos que 1` });
        return;
      }
      if (user2balance < quantidade) {
        let emoji = `<a:errado:1084631043757310043>`;
        const embed_erro = await EmbedCreator({
          title: `${emoji} Erro`,
          description: `${emoji} **Você não pode enviar mais do que possui.**`,
        });
        interaction.editReply({ embeds: [embed_erro] });
        return;
      } else {
        if (
          !user1balance ||
          isNaN(user1balance) === true ||
          user1balance === null
        )
          user1balance = 0;
        const soma = user1balance + quantidade;
        await updateuser({
          guildid: gid.id as string,
          userid: userr.id as string,
          dataconfig: "balance",
          newdatavalue: soma,
        });
        await updateuser({
          guildid: gid.id as string,
          userid: user.id as string,
          dataconfig: "balance",
          newdatavalue: user2balance - quantidade,
        });
        const embed = await EmbedCreator({
          title: `<a:certo:1084630932885078036> Transação concluida.`,
          description: `**Você enviou** \`${quantidade} space coins\` **para o** ${userr}.`,
        });
        interaction.editReply({ embeds: [embed] });
      }
      return;
    } else {
      interaction.editReply({
        content: `Você não pode enviar um pagamento para si mesmo.`,
      });
      return;
    }
  },
});
