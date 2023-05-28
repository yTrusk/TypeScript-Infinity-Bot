import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Prisma } from "@prisma/client";
import { client } from "../main";

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
function embeddesc(description: any, interaction?: any) {
  if (interaction) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user?.tag,
        iconURL: interaction.user?.displayAvatarURL(),
      })
      .setDescription(description)
      .setColor(`#9600D8`)
      .setFooter({
        text: "Infinity System",
        iconURL: client.user?.displayAvatarURL(),
      });
    return embed;
  } else {
    const embed = new EmbedBuilder()
      .setDescription(description)
      .setColor(`#9600D8`)
      .setFooter({
        text: "Infinity System",
        iconURL: client.user?.displayAvatarURL(),
      });
    return embed;
  }
}
function embed1(title: string, desc: string) {
  const embed = new EmbedBuilder()
    .setColor(`#9600D8`)
    .setTimestamp()
    .setTitle(`${title}`)
    .setDescription(`${desc}`);
  return embed;
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
      this.menu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(m.label)
          .setDescription(m.description)
          .setValue(m.value)
      );
    });
  }
  updateInputs() {
    this.row.addComponents(this.menu);
  }
}

interface buttonRowProps {
  id: string;
  emoji: string;
  label: string;
  style: ButtonStyle;
  disabled: boolean;
}
export function buttonsRow(
  props: Array<buttonRowProps>
): ActionRowBuilder<ButtonBuilder> {
  const buttonbuilder = new ActionRowBuilder<ButtonBuilder>();
  const buttons = [] as Array<ButtonBuilder>;
  props.map((button) => {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(button.id)
        .setEmoji(button.emoji)
        .setLabel(button.label)
        .setStyle(button.style)
        .setDisabled(button.disabled)
    );
  });
  buttonbuilder.addComponents(buttons);
  return buttonbuilder;
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

export async function setPremiumExpiration(guildid: string, dias: number) {
  const dataAtual = new Date();
  const dataExpiracao = new Date(dataAtual.getTime());
  dataExpiracao.setDate(dataExpiracao.getDate() + dias);
  const test = await client.prisma.guild.findUnique({
    where: { guild_id: guildid },
  });
  if (!test) {
    await client.prisma.guild.create({
      data: { guild_id: guildid, premium: true, dateexpires: dataExpiracao },
    });
    return;
  }
  await client.prisma.guild.update({
    where: { guild_id: guildid },
    data: { dateexpires: dataExpiracao, premium: true },
  });
  return console.log(
    `O servidor: ${guildid} agora possui premium ativado até ${dataExpiracao}`
  );
}

export async function verificarUsersPremium() {
  const usuarios = await client.prisma.guild.findMany();

  for (const usuario of usuarios) {
    let mensagem;
    let test;
    if (new Date(usuario.dateexpires) > new Date()) {
      test = await client.prisma.guild.update({
        where: { id: usuario.id },
        data: { premium: true },
      });
      mensagem = `O servidor: ${usuario.guild_name} tem premium ativo`;
    } else {
      test = await client.prisma.guild.update({
        where: { id: usuario.id },
        data: { premium: false },
      });
      mensagem = `O servidor: ${usuario.guild_name} não tem premium ativo`;
    }
  }
}

export async function errorreport(error: any) {
  const ho = client.channels.cache.find(
    (c) => c.id === "1100184382309924966"
  ) as TextChannel;
  const embed = embeddesc(`Erro recebido: ${error}`);
  return ho.send({ embeds: [embed] });
}
export { configModal, embeddesc, embed1, ticket, configCreate, userCreate };
