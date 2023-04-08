import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from "discord.js";
import { Constants } from "../../lib/constants.js";
import { getConfigData } from "../../lib/index.js";
import { updateConfigAnalysisMessage, updateConfigReminderMessage } from "../buttons/configToggle.js";

export const data = new ContextMenuCommandBuilder()
    .setName("Delete Message")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false);
/**@param {MessageContextMenuCommandInteraction} interaction */
export default async (interaction) => {
    if (interaction.commandName !== "Delete Message") return;
    var data = await getConfigData("config.utils.deletemessage", interaction.user?.id, interaction.guildId);
    if (!data.data) return interaction.reply({
        ephemeral: true,
        content: "This feature is disabled in this server."
    }).catch(_ => null);
    var perms = interaction.guild?.members.me?.permissionsIn(interaction.channel);
    if (!perms?.has("ManageMessages")) return interaction.reply({
        ephemeral: true,
        content: "Nori has no permission to delete messages. Please contact a server admin."
    }).catch(_ => null);
    if (interaction.targetMessage?.author?.id !== Constants.SOFI_BOT_ID) return interaction.reply({
        ephemeral: true,
        content: "This feature can only be used on Sofi's messages."
    }).catch(_ => null);
    var reference = await interaction.targetMessage.fetchReference().catch(_ => null);
    if (!reference) {
        if(interaction.targetMessage.embeds?.[0]?.data?.author?.name?.includes("CARD VIEW") && interaction.targetMessage.embeds?.[0]?.data?.description.includes(`<@${interaction.user.id}>`)) reference = { author: {id:interaction.user.id}};
        else return interaction.reply({
            ephemeral:true,
            content:"I can't be sure who is the owner of this message... Please do not delete your message before using this feature next time if you did so. It could also be because Nori can't see the channel."
        }).catch(_ => null);
    }
    if (reference.author.id !== interaction.user.id) return interaction.reply({
        ephemeral: true,
        content: "This feature can only be used on your own Sofi messages."
    }).catch(_ => null);
    if (interaction.targetMessage.deletable) interaction.targetMessage.delete().then(_ => interaction.reply({
        ephemeral: true,
        content: "Done!"
    })).catch(_ => {
        return interaction.reply({
            ephemeral: true,
            content: "An error occured.."
        });
    }).catch(_ => null);
    else return interaction.reply({
        ephemeral: true,
        content: "The message is somehow not deletable."
    }).catch(_ => null);
}