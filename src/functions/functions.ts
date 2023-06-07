import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  User,
} from "discord.js";
import { Prisma } from "@prisma/client";
import { client } from "../main";
import ms from "ms";

function configModal(customId: any, title: any, label1: any) {
  const modal = new ModalBuilder().setCustomId(customId).setTitle(title);
  const rbxacc = new TextInputBuilder()
    .setCustomId(`${customId}-s`)
    .setLabel(label1)
    .setStyle(TextInputStyle.Short);
  const rbx = new ActionRowBuilder<TextInputBuilder>().addComponents(rbxacc);
  modal.addComponents(rbx);
  return modal;
}

async function ticket(nome_canal: string, categoria: any, interaction: any) {
  const channel = await interaction.guild?.channels.create({
    name: nome_canal,
    parent: categoria,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: interaction.guild?.id as string,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.AddReactions,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
        ],
      },
    ],
  });
  return channel;
}

interface ModalInput {
  input_id: string;
  input_label: string;
  input_style: TextInputStyle;
  input_place?: string;
  input_maxleng?: number;
  input_minleng?: number;
}
export function inputBuilder(
  props: Array<ModalInput>
): Array<ActionRowBuilder<TextInputBuilder>> {
  const inputs = [] as Array<ActionRowBuilder<TextInputBuilder>>;

  props.map((input) => {
    let sla = input.input_place as string;
    if (!sla) sla = `Digite aqui.`;
    let maxlen = input.input_maxleng;
    if (!maxlen) maxlen = 200;
    let minlen = input.input_minleng;
    if (!minlen) minlen = 0;
    const row = new ActionRowBuilder<TextInputBuilder>();
    row.addComponents(
      new TextInputBuilder()
        .setCustomId(input.input_id)
        .setLabel(input.input_label)
        .setStyle(input.input_style)
        .setPlaceholder(sla)
        .setMaxLength(maxlen)
        .setMinLength(minlen)
    );
    inputs.push(row);
  });
  return inputs;
}

interface SelectMenuString {
  label: string;
  description: string;
  value: string;
  emoji?: string;
}

interface SelectMenuBuilderClassProps {
  customid: string;
  disabled: boolean;
}

export class SelectMenuBuilderClass {
  public row = new ActionRowBuilder<StringSelectMenuBuilder>(); // menu
  public menu = new StringSelectMenuBuilder();

  constructor({ customid, disabled }: SelectMenuBuilderClassProps) {
    this.menu
      .setCustomId(customid)
      .setDisabled(disabled)
      .setPlaceholder(`Selecione uma categoria.`);
  }

  addMenus(props: Array<SelectMenuString>) {
    props.map((m) => {
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(m.label)
        .setDescription(m.description)
        .setValue(m.value);
      if (m.emoji) {
        option.setEmoji(m.emoji);
      }
      this.menu.addOptions(option);
    });
  }
  updateInputs() {
    this.row.addComponents(this.menu);
  }
}

async function configCreate(guildid: any) {
  let guildConfig = await client.prisma.config.create({
    data: {
      guild_id: `${guildid}`,
      logstaff: "0",
      logsugest: "0",
      refstaff: "0",
      antlk: "n",
      logsbv: "0",
      cargoverify: "0",
      cateticket: "0",
      canal_voz: "0",
      autorole: "0",
    },
  });
  return guildConfig;
}
async function userCreate(guild: any, user: any, balance?: number) {
  if (!balance) balance = 0;
  const userGuild = await client.prisma.user.create({
    data: {
      guild_id: guild as string,
      user_id: user as string,
      balance: balance,
    },
  });
  return userGuild;
}

type Maybe<T> = T | null;
type AsyncResult = any;
type AsyncError = any;
type AsyncReturn<R, E> = [Maybe<R>, Maybe<E>];
type AsyncFn = Promise<AsyncResult>;

export async function handle<R = AsyncResult, E = AsyncError>(
  fn: AsyncFn
): Promise<AsyncReturn<R, E>> {
  try {
    const data: R = await fn;
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

interface finduserprops {
  guildid: string;
  userid: string;
}

export async function finduser(props: finduserprops) {
  const { guildid, userid } = props;
  const userguild = await client.prisma.user.findUnique({
    where: {
      guild_id_user_id: {
        guild_id: guildid,
        user_id: userid,
      },
    },
  });
  return userguild;
}
interface updateuserprops {
  guildid: string;
  userid: string;
  dataconfig: string;
  newdatavalue: any;
}
export async function updateuser(props: updateuserprops) {
  const { guildid, userid, dataconfig, newdatavalue } = props;

  const userguildupdated = await client.prisma.user.update({
    where: {
      guild_id_user_id: {
        guild_id: guildid,
        user_id: userid,
      },
    },
    data: {
      [dataconfig]: newdatavalue,
    } as Prisma.UserUpdateInput,
  });
  return userguildupdated;
}
export async function createGuild(guildid: any, guildname: any) {
  const guildcreate = await client.prisma.guild.create({
    data: {
      guild_id: guildid as string,
      guild_name: guildname,
      dateexpires: new Date(),
      premium: false,
    },
    include: {
      config: true,
    },
  });
  return guildcreate;
}

export async function errorreport(error: any) {
  const ho = client.channels.cache.get("1113178570236375100") as TextChannel;
  const embed = await EmbedCreator({ description: `${error}` });
  return ho.send({ embeds: [embed] });
}
export async function embedlogs(
  name: any,
  channelid: any,
  serverid: any,
  servername: any
) {
  if (!channelid) channelid = "Não informado";
  const embed = await EmbedCreator({
    title: `<a:planeta:1084627835408363640> | Logs`,
    description: `<a:certo:1084630932885078036> **Log: \`${name}\`**\n<:info:1084952883818143815> **Canal:** \`${channelid}\`\n**Server:** \`${servername}\`(${serverid})`,
  });
  return embed;
}
export async function logs(embed: EmbedBuilder) {
  const ho = client.channels.cache.get("1112534964181942293") as TextChannel;
  return ho.send({ embeds: [embed] });
}

interface buttonRowPropsV2 {
  id?: string;
  emoji?: string;
  style?: ButtonStyle;
  label?: string;
  disabled?: boolean;
  url?: string;
}

export function buttonCreator(props: buttonRowPropsV2[]) {
  const buttons: AnyComponentBuilder[] = props.map((prop) => {
    const buttonbuilder = new ButtonBuilder().setStyle(
      prop.style || ButtonStyle.Primary
    );
    if (prop.id) {
      buttonbuilder.setCustomId(prop.id);
    }
    if (prop.disabled !== undefined) {
      buttonbuilder.setDisabled(prop.disabled);
    }
    if (prop.emoji) {
      buttonbuilder.setEmoji(prop.emoji);
    }
    if (prop.label) {
      buttonbuilder.setLabel(prop.label);
    }
    if (prop.url) {
      buttonbuilder.setURL(prop.url);
    }
    return buttonbuilder as AnyComponentBuilder;
  });
  const actionRow = new ActionRowBuilder().addComponents(...buttons);
  const convertActionRowToJSON = (actionRow: ActionRowBuilder): any => {
    return JSON.parse(JSON.stringify(actionRow));
  };
  const botao = convertActionRowToJSON(actionRow);
  return botao;
}

interface fieldsProps {
  name: string;
  value: string;
  inline: boolean;
}
interface authorProps {
  name: string;
  iconurl?: string;
}
interface embedcreatorProps {
  description?: string;
  title?: string;
  color?: string;
  thumbnail?: string;
  image?: string;
  fields?: fieldsProps[];
  author?: authorProps[];
}

export async function EmbedCreator(props: embedcreatorProps) {
  const embed = new EmbedBuilder()
    .setColor((props.color as ColorResolvable) || ("9600D8" as ColorResolvable))
    .setFooter({
      text: `Infinity System`,
      iconURL: client.user?.avatarURL() || undefined,
    })
    .setTimestamp();
  if (props.description) {
    embed.setDescription(props.description);
  }
  if (props.title) {
    embed.setTitle(props.title);
  }
  if (props.fields) {
    props.fields.forEach((fields) => {
      embed.addFields({
        name: fields.name,
        value: fields.value,
        inline: fields.inline,
      });
    });
  }
  if (props.author) {
    props.author.forEach((auth) => {
      embed.setAuthor({ name: auth.name, iconURL: auth.iconurl || undefined });
    });
  }
  if (props.image) {
    embed.setImage(props.image || null);
  }
  if (props.thumbnail) {
    embed.setImage((props.image as string) || null);
  }
  return embed;
}

export { configModal, ticket, configCreate, userCreate };
