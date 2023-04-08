import { StringSelectMenuInteraction } from "discord.js";
//import { updateConfigServerMinigame } from "../buttons/configToggle.js";

export default async (interaction) => {
    if (interaction.customId.startsWith("serverDropMenuSelector")) {
        if (Date.now() - parseInt(interaction.customId.split("_")[interaction.customId.split("_").length - 1]) >= 480000) return;
        if (interaction.values[0] == "minigameOption") {

        } else if (interaction.values[0] == "seriesPhaseOneOption") {

        } else if (interaction.values[0] == "seriesPhaseTwoOption") {

        } else if (interaction.values[0] == "captchaOption") {

        }
    }
}
