import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Guild,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  EmbedCreator,
  createGuild,
  errorreport,
  finduser,
  updateuser,
  userCreate,
} from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "add",
  description: "[Economia] Adicione saldo para um usuário.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Selecione um usuário.`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: `quantidade`,
      description: `Selecione a quantidade de moedas que deseja adicionar.`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({});
    const u = options.getUser("usuário") as User;
    const guildpremium = await client.prisma.guild.findUnique({
      where: { guild_id: interaction.guild?.id as string },
    });
    if (!guildpremium) {
      try {
        await createGuild(interaction.guild?.id, interaction.guild?.name);
      } catch {
        async (userError: any) => {
          if (userError !== null) {
            await errorreport(userError);
          }
        };
      }
    }
    if (guildpremium?.premium === true) {
      const q = options.getNumber("quantidade") as number;
      const embed = await EmbedCreator({description: `<a:carregando:1084633391820980254> **Processando adição de saldo...**`})
      const gid = interaction.guild as Guild;
      let userGuild = await finduser({
        guildid: interaction.guild?.id as string,
        userid: u?.id as string,
      });
      const bal = userGuild?.balance as number;
      if (!userGuild) {
        try {
          await userCreate(gid.id as string, u.id as string, q);
        } catch {}
        interaction.editReply({ embeds: [embed] }).then(async () => {
          const embed = await EmbedCreator({description: `<a:certo:1084630932885078036> **Adição de saldo concluida com sucesso.**`})
          interaction.editReply({ embeds: [embed] });
        });
        return;
      } else {
        await updateuser({
          guildid: gid.id as string,
          userid: u.id as string,
          dataconfig: "balance",
          newdatavalue: bal + q,
        });
        interaction.editReply({ embeds: [embed] }).then(async () => {
          const embed = await EmbedCreator({description: `<a:certo:1084630932885078036> **Adição de saldo concluida com sucesso.**`})
          interaction.editReply({ embeds: [embed] });
        });
        return;
      }
    } else {
      interaction.editReply({
        content: `<a:errado:1084631043757310043> **Erro, para utilizar este comando precisa ser adm e ter comprado o modulo premium.**`,
      });
    }
  },
});
