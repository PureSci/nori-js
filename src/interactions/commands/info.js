import { ChatInputCommandInteraction, Colors, SlashCommandBuilder } from "discord.js";
import { updateConfigAnalysisMessage, updateConfigReminderMessage } from "../buttons/configToggle.js";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows some Info about the Bot.").setDMPermission(true);
/**@param {ChatInputCommandInteraction} interaction */
export default async (interaction) => {
    if (interaction.commandName !== "info") return;
    var i = 0;
    interaction.client.guilds.cache.forEach(x => {
        i += x.memberCount;
    });
    interaction.reply({
        embeds: [{
            title: "Info",
            fields: [{
                name: "Servers",
                value: `\`\`\`prolog\n${interaction.client.guilds.cache.size}\n\`\`\``,
                inline: true
            }, {
                name: "Users",
                value: `\`\`\`prolog\n${i}\n\`\`\``,
                inline: true
            }],
            color: Colors.Aqua,
            thumbnail: {
                url: interaction.client.user.avatarURL()
            }
        }]
    }).catch(_ => null);
}
