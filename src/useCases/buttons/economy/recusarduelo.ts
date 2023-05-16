import { ButtonStyle } from "discord.js";
import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";
import { buttonsRow, embeddesc } from "../../../functions/functions";

export default class RecusarDueloClass extends actionEvent {
    constructor(client: ExtendedClient){
        super(client, {
            event: 'recusarduelo',
            type: 'button',
            guild: {
                include: {

                }
            }
        })
   }
   async execute({ client, interaction }: actionEventProps){
        if(!interaction.isButton()) return;
   interaction.reply({
     content: `<a:errado:1084631043757310043> **Você recusou o duelo.**`, ephemeral: true,
   });
          
   }
}