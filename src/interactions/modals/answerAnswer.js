import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalSubmitInteraction } from "discord.js";
import { Constants } from "../../lib/constants.js";

export default (interaction) => {
    if (interaction.customId.startsWith("answerModal")) {
        if (interaction.user.id !== Constants.PURE_ID) return;
        var user = interaction.client.users.cache.get(interaction.customId.split("_")[1]);
        if (user) {
            user.send({
                content: `${Constants.DEV_ANS_HEADER}\n\n${interaction.fields.getTextInputValue("answerModalText")}`
            }).catch(_ => null);
        }
        interaction.reply({
            content: "Done!"
        }).catch(_ => null);
    }
}