import { Interaction, Guild as DiscordGuild } from 'discord.js'
import { ExtendedClient } from '../configs/ExtendedClient'
import {  Guild, Prisma } from '@prisma/client'

export interface actionEventProps {
    client: ExtendedClient;
    interaction: Interaction & {
        guild: DiscordGuild | null
    }
    guild?: Guild | Prisma.GuildSelect 
}

export type OptionsType = 'button' | 'selectmenu' | 'modal'

export type Options = {
    event: string
    type: OptionsType;

    guild?: {
        include?: Prisma.GuildInclude | null
    }
}

export class actionEvent {
    execute(options: actionEventProps){
        throw new Error("execute not implemented")
    }
    public client: ExtendedClient;
    public config: Options;

    constructor(client: ExtendedClient, config: Options){
        this.client = client;
        this.config = {
            event: config.event,
            type: config.type,
            guild: {
                include: config.guild?.include ?? {}
            }
        };
    }
}