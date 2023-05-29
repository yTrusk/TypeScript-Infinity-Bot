import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  User,
  UserAvatarFormat,
} from "discord.js";
import { Command } from "../../configs/types/Command";
import { errorreport, handle, userCreate } from "../../functions/functions";
import { client } from "../../main";

export default new Command({
  name: "perfil",
  description: "[Member] Veja informações de um usuário.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: `usuário`,
      description: `Mencione um usuário.`,
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  async run({ interaction, options }) {
    if (!interaction.isCommand()) return;
    let user = options.getUser("usuário");
    if (!user) user = interaction.user as User;
    let userGuild = await client.prisma.user.findUnique({
      where: {
        guild_id_user_id: {
          guild_id: interaction.guildId as string,
          user_id: user?.id as string,
        },
      },
    });
    if (!userGuild) {
      const [user, userError] = await handle(
        userCreate(interaction.guild?.id, interaction.user.id)
      );
      if (userError !== null) {
        await errorreport(userError);
      }
    }
    let conta = user?.createdAt.toLocaleString();
    let id = user?.id;
    let tag = user?.tag;
    let bot = user?.bot;
    let flag2 = {
      Staff: "<:moderador:1065653834430546010>",
      Partner: "<:partner:1065651364832759919>",
      Hypesquad: "<:5271badgehypesquad:1065651054034812981>",
      BugHunterLevel1: "<:NL_badgeBugHunter:1065651010179170314>",
      BugHunterLevel2: "<:buggold:1066141595575009330>",
      HypeSquadOnlineHouse1: "<:bravery:1095810904030986330>",
      HypeSquadOnlineHouse2: "<:brilliance:1095810957005041865> ",
      HypeSquadOnlineHouse3: "<:hype:1095811983921664094> ",
      PremiumEarlySupporter: "<:Nitro:1065652522250944612>",
      PremiumPromoDismissed: "<:Nitro:1065652522250944612>",
      TeamPseudoUser: "não sei",
      HasUnreadUrgentMessages: "n sei",
      BotHTTPInteractions: "n sei",
      DisablePremium: "n sei",
      Quarantined: "n sei",
      Collaborator: "n sei",
      RestrictedCollaborator: "n sei",
      VerifiedBot: "<:bot2:1055589678323089559>",
      VerifiedDeveloper: "<:dev:1065651289817624647>",
      CertifiedModerator: "<:mod:1066141635760640000>",
      ActiveDeveloper: "<:badgedevactive:1065650906626019371>",
      Spammer: "<:spammer:1055589795675508747>",
      MFASMS: "<:mfa:123456789012345678>",
    };

    let flags: string | null = user.flags
      ? user.flags
          .toArray()
          .map((f) => flag2[f])
          .join("")
      : null;
    if (!flags) flags = "Sem badges";

    let embed = new EmbedBuilder()
      .setColor("#9600D8")
      .setAuthor({
        name: user?.username,
        iconURL: user?.displayAvatarURL(),
      })
      .setThumbnail(user?.displayAvatarURL())
      .setTitle(`${user?.username}#${user?.discriminator} ${flags}`)
      .setDescription(
        "<:cliente:1084634375997632582> **Informações do Usuário:**"
      )
      .addFields(
        {
          name: `<a:starss:1084635127163920454> Tag:`,
          value: `\`${tag}\``,
          inline: true,
        },
        {
          name: `<:config:1084633909020602420> Id:`,
          value: `\`${id}\``,
          inline: true,
        },
        {
          name: `<:tabela:1084631840528281701> Criação da conta:`,
          value: `\`${conta}\``,
          inline: true,
        },
        {
          name: `⠀`,
          value: `\`\`\`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\`\`\``,
          inline: false,
        },
        {
          name: `<:caixa:1084628554668572692> Space coins:`,
          value: `\`${userGuild?.balance}\``,
          inline: false,
        }
      );

    let botao = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setURL(user?.displayAvatarURL() as UserAvatarFormat)
        .setEmoji("<:info:1084952883818143815>")
        .setStyle(ButtonStyle.Link)
        .setLabel(`Ver avatar de ${user?.username}.`)
    );

    interaction.reply({ embeds: [embed], components: [botao] });
  },
});
