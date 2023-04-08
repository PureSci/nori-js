import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Embed, EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";

export default (interaction) => {
    if (interaction.customId.startsWith("submitReportModal")) {
        var channel = interaction.client.channels.cache.get("1062083180628299857");
        if (channel?.isTextBased()) {
            var ac = interaction.client.channels.cache.get(interaction.customId.split("_")[1]);
            if (ac?.type !== ChannelType.GuildText) return;
            var msg = ac?.messages?.cache.get(interaction.customId.split("_")[2]);
            if (ac?.isTextBased()) channel?.send({
                content: `${interaction.fields.getTextInputValue("reportReason")}, <@${interaction.user.id}>\n${msg?.attachments?.first()?.url ? msg?.attachments?.first()?.url : ""}`,
                components: [
                    new ActionRowBuilder().addComponents(new ButtonBuilder({
                        customId: "reportAnswer_" + interaction.user.id,
                        label: "Answer",
                        style: ButtonStyle.Success
                    }))
                ],
                embeds: msg?.attachments?.first()?.url ? [] : [EmbedBuilder.from(msg?.embeds?.[0]?.toJSON())]
            }).catch(_ => null);
        }
        interaction.reply({
            content: "Thank you for the report!",
            ephemeral: true
        }).catch(_ => null);
    }
}