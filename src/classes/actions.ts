import { Interaction } from 'discord.js'
import { ExtendedClient } from '../configs/ExtendedClient'

export interface actionEventProps {
    client: ExtendedClient,
    interaction: Interaction
}

export type OptionsType = 'button' | 'selectmenu' | 'modal'

export type Options = {
    event: string
    type: OptionsType
}

export class actionEvent {
    execute(options: actionEventProps){
        throw new Error("execute not implemented")
    }
    public client: ExtendedClient;
    public config: Options;

    constructor(client: ExtendedClient, config: Options){
        this.client = client;
        this.config = config;
    }
}