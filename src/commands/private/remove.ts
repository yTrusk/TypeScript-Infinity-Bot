import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  embeddesc,
  finduser,
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
    const user = options.getUser("usuário");
    const many = options.getNumber("quantidade") as number;
    const userguild = await finduser({
      guildid: interaction.guild?.id as string,
      userid: user?.id as string,
    });
    if (!userguild) {
      await userCreate(interaction.guild?.id, user?.id);
    }
    const bal = userguild?.balance as number;
    if (bal === 0) {
      const embed = embeddesc(
        `<a:errado:1084631043757310043> **Erro, o usuário selecionado possui 0 de saldo, não é possivel remover mais.**`,
        interaction
      );
      return interaction.editReply({ embeds: [embed] });
    } else {
      const soma = bal - many;
      let q;
      if (bal - many < 0) q = 0;
      if (bal - many > 0) q = soma;
      const userguildupdated = await updateuser({
        userid: user?.id as string,
        guildid: interaction.guild?.id as string,
        dataconfig: "balance",
        newdatavalue: q,
      });
      const embed = embeddesc(
        `<a:certo:1084630932885078036> **Remoção de saldo concluida com sucesso.**\n<:coins:1095800360829980762> **Saldo do usuário:** \`${userguildupdated.balance}\``,
        interaction
      );
      interaction.editReply({ embeds: [embed] });
    }
  },
});
