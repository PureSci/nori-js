import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { updateConfigAnalysisMessage, updateConfigReminderMessage, updateConfigUtilsMessage } from "../buttons/configToggle.js";

export const data = new SlashCommandBuilder()
    .setName("serverconfig")
    .setDescription("Opens the server config menu.")
    .addStringOption(option =>
        option.setName("category").setDescription("Category of config.")
            .addChoices(
                { name: "Reminders", value: "serverconfigCommand_reminders" },
                { name: "Analysis", value: "serverconfigCommand_analysis" },
                { name: "Utils", value: "serverconfigCommand_utils" }
                //{ name: "Server Drops", value: "serverconfigCommand_serverdrops" }
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels).setDMPermission(false);

export default async (interaction) => {
    const member = interaction.member;
    if (interaction.commandName !== "serverconfig") return;
    if (!member?.permissions?.has("ManageChannels")) return interaction.reply({ ephemeral: true, content: "You must have the `Manage Channels` permission in order to use this command." }).catch(_ => null);
    var category = interaction.options.getString("category");
    if (!category) category = "serverconfigCommand_reminders";
    var selected = category.split("_")[1];
    if (selected == "reminders") return updateConfigReminderMessage(interaction, true, true);
    else if (selected == "analysis") return updateConfigAnalysisMessage(interaction, true);
    else if (selected == "utils") return updateConfigUtilsMessage(interaction, true);
    //else if (selected == "serverdrops") return updateConfigServerMinigame(interaction, true);

}