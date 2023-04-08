import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

/**
 * @param {ButtonInteraction} interaction
 */
export default async (interaction) => {
    if (interaction.customId.startsWith("reportAnswer")) {
        if (interaction.user.id !== "353623899184824330") return;
        await interaction.showModal(new ModalBuilder({
            customId: `answerModal_${interaction.customId.split("_")[1]}`,
            title: "Answer this Report"
        }).addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder({
                    customId: "answerModalText",
                    label: "Write what you are answering with",
                    style: TextInputStyle.Paragraph,
                    placeholder: "e.g. Thank you"
                })
            )
        )).catch(_ => null);
    }
}