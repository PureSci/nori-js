import { StringSelectMenuInteraction } from "discord.js";
import { updateConfigAnalysisMessage, updateConfigReminderMessage, updateConfigUtilsMessage } from "../buttons/configToggle.js";

export default async (interaction) => {
    if (interaction.customId.startsWith("configSelector")) {
        if (Date.now() - parseInt(interaction.customId.split("_")[interaction.customId.split("_").length - 1]) >= 480000) return;
        if (interaction.values[0] == "remindersOption") {
            updateConfigReminderMessage(interaction, false, interaction.customId.split("_")[1] == "server" ? true : false);
        } else if (interaction.values[0] == "analysisOption") {
            updateConfigAnalysisMessage(interaction, interaction.customId.split("_")[1] == "server" ? true : false);
        } else if (interaction.values[0] == "utilsOption") {
            updateConfigUtilsMessage(interaction);
        }
    }
}
