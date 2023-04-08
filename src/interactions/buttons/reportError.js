import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default async (interaction) => {
    if (interaction.customId.startsWith("reportError")) {
        if (interaction.user.id !== interaction.customId.split("_")[1]) return;
        await interaction.showModal(new ModalBuilder({
            customId: `submitReportModal_${interaction.customId.split("_")[2]}_${interaction.customId.split("_")[3]}`,
            title: "Report This Analyse"
        }).addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder({
                    customId: "reportReason",
                    label: "Write the reason of your report.",
                    style: TextInputStyle.Short,
                    placeholder: "e.g. The wishlist of the card shouldn't be \"Low\""
                })
            )
        )).catch(_ => null);
    }
}