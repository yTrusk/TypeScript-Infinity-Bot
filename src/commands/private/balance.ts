import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  User,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import {
  EmbedCreator,
  errorreport,
  finduser,
  handle,
  userCreate,
} from "../../functions/functions";

export default new Command({
  name: "saldo",
  description: "[Economia] Consulte seu saldo.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Selecione o usuário que deseja ver o saldo.`,
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let user = options.getUser("usuário");
    if (!user) user = interaction.user as User;
    let userGuild = await finduser({
      guildid: interaction.guild?.id as string,
      userid: user?.id as string,
    });
    if (!userGuild) {
      const [user, userError] = await handle(
        userCreate(interaction.guild?.id, interaction.user.id)
      );
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    const embed1s = await EmbedCreator({description: `<:config:1084633909020602420> Consultando saldo...`})
    interaction.reply({ embeds: [embed1s] }).then(async () => {
      if (user?.id === interaction.user.id) {
        const embed = await EmbedCreator({title: `<:banco:1079896026124664903> Saldo`, description: `<:cliente:1084634375997632582> **Você possui:** \`${userGuild?.balance} space coins\` **no seu banco.** \n<:dinheiro:1084628513707016253> **Para aumentar seus \`space coins\` utilize /work ou tente a sorte em /roleta**`})
        interaction.editReply({ embeds: [embed] });
      } else {
        const embed = await EmbedCreator({title: `<:banco:1079896026124664903> Saldo`, description: `<:cliente:1084634375997632582> **O usuário ${user}, possui:** \`${userGuild?.balance} space coins\` **em seu banco.`})
        interaction.editReply({ embeds: [embed] });
      }
    });
  },
});
