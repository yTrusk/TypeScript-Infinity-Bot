import { actionEvent, actionEventProps } from "../../../classes/actions";
import { ExtendedClient } from "../../../configs/ExtendedClient";

export default class RecusarDueloClass extends actionEvent {
    constructor(client: ExtendedClient){
        super(client, {
            event: 'recusarduelo',
            type: 'button'
        })
   }
   async execute({ client, interaction }: actionEventProps){
        if(!interaction.isButton()) return;
    /*
        const embed = embeddesc(
            `O usuário: ${user2} recusou o duelo`,
            interaction
          );
          interaction.editReply({ embeds: [embed], components: [row2] });
          */
   }
}