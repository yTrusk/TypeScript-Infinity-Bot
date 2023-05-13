import { client } from "../../main";
import { Event } from "../../configs/types/event";

export default new Event({
    name: "interactionCreate",
   run(interaction) {
    if(interaction.isModalSubmit()) client.modals.get(interaction.customId)?.(interaction);
    if(interaction.isButton()) client.buttons.get(interaction.customId)?.(interaction);
    if(interaction.isStringSelectMenu()) client.selects.get(interaction.customId)?.(interaction);
    }
})