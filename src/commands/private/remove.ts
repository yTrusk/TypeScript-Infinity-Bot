import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  EmbedCreator,
  errorreport,
  finduser,
  handle,
  updateuser,
  userCreate,
} from "../../functions/functions";

export default new Command({
  name: "remove",
  description: "[Economia] Remova um saldo de um usuário.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "usuário",
      description: "Selecione o usuário que deseja remover o saldo.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "quantidade",
      description: "Digite a quantidade que deseja remover.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({});
    const users = options.getUser("usuário");
    const many = options.getNumber("quantidade") as number;
    const userguild = await finduser({
      guildid: interaction.guild?.id as string,
      userid: users?.id as string,
    });
    if (!userguild) {
      const [user, userError] = await handle(
        userCreate(interaction.guild?.id, users?.id)
      );
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const bal = userguild?.balance as number;
    if (bal === 0) {
      const embed = await EmbedCreator({description: `<a:errado:1084631043757310043> **Erro, o usuário selecionado possui 0 de saldo, não é possivel remover mais.**`})
      return interaction.editReply({ embeds: [embed] });
    } else {
      const soma = bal - many;
      let q;
      if (bal - many < 0) q = 0;
      if (bal - many > 0) q = soma;
      const userguildupdated = await updateuser({
        userid: users?.id as string,
        guildid: interaction.guild?.id as string,
        dataconfig: "balance",
        newdatavalue: q,
      });
      const embed = await EmbedCreator({description: `<a:certo:1084630932885078036> **Remoção de saldo concluida com sucesso.**\n<:coins:1095800360829980762> **Saldo do usuário:** \`${userguildupdated.balance}\``})
      interaction.editReply({ embeds: [embed] });
    }
  },
});
