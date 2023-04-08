import { ButtonInteraction } from "discord.js";
import { updateConfigReminderMessage } from "./configToggle.js";

export default async (interaction) => {
    if (interaction.customId.startsWith("configButton")) {
        if (interaction.user.id !== interaction.customId.split("_")[1]) return;
        if (Date.now() - parseInt(interaction.customId.split("_")[2]) >= 480000) return;
        await updateConfigReminderMessage(interaction, true)
    }
}

/*
Guild:
    reminders:
        drop: true,
        grab: false,
        raid: false,
    analysis:
        deleteExpired: true,


*/