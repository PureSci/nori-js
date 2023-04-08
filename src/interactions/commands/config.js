import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateConfigAnalysisMessage, updateConfigReminderMessage } from "../buttons/configToggle.js";

export const data = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Opens the config menu.")
  .addStringOption(option =>
    option.setName("category").setDescription("Category of config.")
      .addChoices({ name: "Reminders", value: "configCommand_reminders" }, { name: "Analysis", value: "configCommand_analysis" })
  ).setDMPermission(false);

export default async (interaction) => {
  if (interaction.commandName !== "config") return;
  var category = interaction.options.getString("category");
  if (!category) category = "configCommand_reminders";
  var selected = category.split("_")[1];
  if (selected == "reminders") return updateConfigReminderMessage(interaction);
  else if (selected == "analysis") return updateConfigAnalysisMessage(interaction);
}