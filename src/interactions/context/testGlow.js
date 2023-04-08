import { ApplicationCommandType, ActionRowBuilder, AttachmentBuilder, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import fetch from "node-fetch";
import { Constants } from "../../lib/constants.js";
import { getGlow, pushGlow } from "../../lib/initDB.js";
import { createCanvas, loadImage } from "canvas";


export const data = new ContextMenuCommandBuilder()
    .setName("Test Glow")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false);
/**@param {MessageContextMenuCommandInteraction} interaction */
export default async (interaction) => {
    if (interaction.commandName !== "Test Glow") return;
    return interaction.reply({
        ephemeral: true,
        content: "Sorry, we currently disabled the test glow."
    });
    if (interaction.targetMessage.author.id !== Constants.SOFI_BOT_ID || !interaction.targetMessage.embeds?.[0]?.data?.author?.name?.includes("CARD VIEW")) return interaction.reply({
        ephemeral: true,
        content: "Please use this on the message of Sofi after using `sview`"
    });
    interaction.showModal(new ModalBuilder({
        title: "Card Glow Tester",
        customId: "testGlowModal"
    }).addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder({
        customId: "glowcodeModalInput",
        label: "Glow Code",
        placeholder: "#hap9j0",
        style: TextInputStyle.Short,
        required: true
    })), new ActionRowBuilder().addComponents(new TextInputBuilder({
        customId: "useridModalInput",
        label: "GlowOwner's DiscordID(no need if given befor)",
        placeholder: "353623899184824330",
        style: TextInputStyle.Short,
        required: false
    }))));
    var i = await interaction.awaitModalSubmit({ filter: (i) => i.customId == "testGlowModal" && i.user.id == interaction.user.id, time: 60000 }).catch(_ => null);
    if (!i) return;
    var glowcode = i.fields?.getTextInputValue("glowcodeModalInput");
    var userid = i.fields?.getTextInputValue("useridModalInput");
    var g = (glow) => {
        if (!glow) return i.reply({
            ephemeral: true,
            content: "Glow not found."
        }).catch(_ => null);
        if (glow.color2) return i.reply({
            ephemeral: true,
            content: "Sorry, we are currently not supporting super glows."
        }).catch(_ => null);
        var imageurl = interaction.targetMessage.embeds?.[0]?.image.url;
        if (!imageurl) return i.reply({
            ephemeral: true,
            content: "An error occured."
        }).catch(_ => null);
        loadImage(imageurl).then(image => {
            var canvas = createCanvas(image.width, image.height);
            var ctx = canvas.getContext("2d");
            ctx.shadowColor = glow.color;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 20;
            ctx.drawImage(image, 0, 0);
            i.reply({
                files: [new AttachmentBuilder(canvas.toBuffer())
                ]
            }).catch(_ => null);
        });
    }
    var glowdata = getGlow(glowcode);
    if ((!glowdata) && userid) {
        fetch(`https://api.sofi.gg/glows/${userid}`).then(r => r.json()).then(r => {
            if (r.discorduser == null) return i.reply({
                ephemeral: true,
                content: "Invalid Discord ID"
            }).catch(_ => null);
            r.glows.forEach(glow => {
                var obj = {
                    color: glow.code
                };
                if (glow.super) obj["color2"] = glow.code2;
                pushGlow("#" + glow.viewcode, obj);
            });
            var glow = getGlow(glowcode);
            g(glow);
        }).catch(_ => {
            return i.reply({
                ephemeral: true,
                content: "An Error occured."
            }).catch(_ => null);
        });
    } else if ((!glowdata) && (!userid)) return i.reply({
        ephemeral: true,
        content: "Couldn't find this glow. Please try again along with entering owners id."
    }).catch(_ => null);
    else {
        g(glowdata);
    }
}