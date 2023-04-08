import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
import { Constants } from "../../lib/constants.js";
import { db } from "../../index.js";
import { getConfigData } from "../../lib/index.js";
//import { getConfigData } from "../../lib/index.js";

export default async (interaction) => {
    if (interaction.customId.startsWith("configToggle")) {
        if (Date.now() - parseInt(interaction.customId.split("_")[interaction.customId.split("_").length - 1]) >= 480000) return;
        var obj = interaction.customId.split("_");
        /**
         * 0               1        2   3
         * configToggle_reminders_user_drop_timestamp
         * configToggle_analysis_server_grab_timestamp
         */
        if (obj[1] == "reminders" && obj[2] == "user") {
            var reminders = await getConfigData(`reminders.${obj[3]}`, interaction.user.id, interaction.guildId);
            var m;
            if (reminders.default) m = true;
            else if (reminders.data == true) m = "dm";
            else if (reminders.data == "dm") m = false;
            else if (reminders.data == false) m = undefined;
            await db.set(`${interaction.user.id}.reminders.${obj[3]}`, m);
            updateConfigReminderMessage(interaction);
        } else if (obj[1] == "reminders" && obj[2] == "server") {
            var reminders = await getConfigData(`reminders.${obj[3]}`, interaction.user.id, interaction.guildId, true);
            var m;
            if (reminders.data == false) m = true;
            else if (reminders.data == true) m = "dm";
            else if (reminders.data == "dm") m = false;
            await db.set(`${interaction.guild?.id}.reminders.${obj[3]}`, m);
            updateConfigReminderMessage(interaction, false, true);
        } else if (obj[1] == "analysis" && obj[2] == "server") {
            if (obj[3].startsWith("navigate")) {
                var type = await getConfigData(`config.analysis.type`, interaction.user.id, interaction.guildId, true);
                var m;
                if (type.data == 1 && obj[3] == "navigateLeft") m = 2;
                else if (type.data == 2 && obj[3] == "navigateRight") m = 1;
                else if (obj[3] == "navigateLeft") m = type.data - 1;
                else if (obj[3] == "navigateRight") m = type.data + 1;
                await db.set(`${interaction.guild?.id}.config.analysis.type`, m);
                updateConfigAnalysisMessage(interaction, true);
                return;
            }
            var analysis = await getConfigData(`config.analysis.${obj[3]}`, interaction.user.id, interaction.guildId, true);
            await db.set(`${interaction.guild?.id}.config.analysis.${obj[3]}`, !analysis.data);
            updateConfigAnalysisMessage(interaction, true);
        } else if (obj[1] == "utils" && obj[2] == "server") {
            var utils = await getConfigData(`config.utils.${obj[3]}`, interaction.user.id, interaction.guildId, true);
            await db.set(`${interaction.guild?.id}.config.utils.${obj[3]}`, !utils.data);
            updateConfigUtilsMessage(interaction);
        } else if (obj[1] == "analysis" && obj[2] == "user") {
            if (obj[3].startsWith("navigate")) {
                var type = await getConfigData(`config.analysis.type`, interaction.user.id, interaction.guildId);
                var m;
                if (type.default) m = 1;
                else if (type.data == 1 && obj[3] == "navigateLeft") m = undefined;
                else if (type.data == 2 && obj[3] == "navigateRight") m = undefined;
                else if (obj[3] == "navigateLeft") m = type.data - 1;
                else if (obj[3] == "navigateRight") m = type.data + 1;
                await db.set(`${interaction.user.id}.config.analysis.type`, m);
                updateConfigAnalysisMessage(interaction);
                return;
            }
            var analysis = await getConfigData(`config.analysis.${obj[3]}`, interaction.user.id, interaction.guildId);
            var m;
            if (analysis.default) m = true;
            else if (analysis.data == true) m = false;
            else if (analysis.data == false) m = undefined;
            await db.set(`${interaction.user.id}.config.analysis.${obj[3]}`, m);
            updateConfigAnalysisMessage(interaction);
        }
    }
}

export async function updateConfigUtilsMessage(interaction, isSend = false) {
    var isServer = true;
    var utils = await getConfigData("config.utils", interaction.user.id, interaction.guildId, isServer);
    var u = (name, key, index, description) => {
        var foo = utils[key];
        return `\`${index}]\` ${foo.data ? Constants.ON_EMOTE : Constants.OFF_EMOTE} • \`${name}\` • **${foo.data ? "Enabled" : "Disabled"}** ${foo.default ? "<Server Default>" : ""}\n*${description}*`;
    }
    var embed = {
        embeds: [{
            title: isServer ? "Server Utils Config" : undefined,
            description: `${u("Delete Message Option", "deletemessage", 1, "Enabling this option allows the users to delete their Sofi messages using Discord's new apps function. Nori needs the `ManageMessages` permission for this feature.")}`,
            color: 15641224,
            footer: {
                text: "Use the Buttons below to toggle the attached option to it."
            },
            thumbnail: {
                url: isServer ? interaction.guild?.iconURL() : ""
            }
        }],
        components: [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder({
            customId: `configSelector_${isServer ? "server" : "user"}_` + Date.now()
        }).addOptions(
            {
                label: "Reminders",
                description: "Config of Reminders.",
                emoji: Constants.REMINDER_EMOTE_ID,
                value: "remindersOption"
            },
            {
                label: "Analysis",
                description: "Config of Analysis Messages, or types.",
                emoji: "🔍",
                value: `analysisOption`
            },
            {
                label: "Utils",
                description: "Config of Utils.",
                emoji: "💡",
                value: "utilsOption",
                default: true
            }
        )),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: "1",
                customId: `configToggle_utils_${isServer ? "server" : "user"}_deletemessage_` + Date.now(),
                style: ButtonStyle.Primary
            })
        )
        ]
    };
    if (isSend || interaction.isChatInputCommand()) return interaction.reply({ ephemeral: true, ...embed }).catch(_ => null);
    interaction.update(embed).catch(_ => null);
}

export async function updateConfigReminderMessage(interaction, k = false, isServer = false) {
    var reminders = await getConfigData("reminders", interaction.user.id, interaction.guildId, isServer);
    var u = (name, index) => {
        var foo = reminders[name.toLowerCase()];
        return `\`${index}]\` ${foo.data ? Constants.ON_EMOTE : Constants.OFF_EMOTE} • \`${name}\` • **${foo.data ? "Enabled" : "Disabled"}${foo.data == "dm" ? " DM" : ""}** ${foo.default ? "<Server Default>" : ""}`;
    }
    var embed = {
        embeds: [{
            title: isServer ? "Server Reminder Config" : undefined,
            author: isServer ? undefined : {
                name: "User Reminder Config",
                icon_url: interaction.user.avatarURL()
            },
            description: `${u("Drop", 1)}\n${u("Grab", 2)}\n${u("Raid", 3)}\n${u("Miner", 4)}`,
            color: 15641224,
            footer: {
                text: "Use the Buttons below to toggle the attached option to it."
            },
            thumbnail: {
                url: isServer ? interaction.guild?.iconURL() : ""
            }
        }],
        components: [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder({
            customId: `configSelector_${isServer ? "server" : "user"}_` + Date.now()
        }).addOptions(
            {
                label: "Reminders",
                description: "Config of Reminders.",
                emoji: Constants.REMINDER_EMOTE_ID,
                value: "remindersOption",
                default: true
            },
            {
                label: "Analysis",
                description: "Config of Analysis Messages, or types.",
                emoji: "🔍",
                value: "analysisOption"
            }
        )),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: "1",
                customId: `configToggle_reminders_${isServer ? "server" : "user"}_drop_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "2",
                customId: `configToggle_reminders_${isServer ? "server" : "user"}_grab_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "3",
                customId: `configToggle_reminders_${isServer ? "server" : "user"}_raid_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "4",
                customId: `configToggle_reminders_${isServer ? "server" : "user"}_miner_` + Date.now(),
                style: ButtonStyle.Primary
            })
        )
        ]
    };
    if (isServer) embed.components[0].components[0].addOptions({
        label: "Utils",
        description: "Config of Utils.",
        emoji: "💡",
        value: "utilsOption"
    });
    if (k || interaction.isChatInputCommand()) return interaction.reply({ ephemeral: true, ...embed }).catch(_ => null);
    interaction.update(embed).catch(_ => null);
}

const exampleCards = [
    {
        wl: "Low ",
        name: "Name",
        series: "Series",
        gen: "ɢ1304"
    }, {
        wl: "134 ",
        name: "Name",
        series: "Series",
        gen: "ɢ83  "
    }, {
        wl: "43  ",
        name: "Name",
        series: "Series",
        gen: "ɢ591 "
    }
];

export const analysisTypes = {
    1: {
        name: "Default",
        description: undefined,
        msg: (cards, ms, showgen, pingme, sdol, timegenerated, userid) => {
            return `\`1]\` • ${Constants.WISH_EMOTE} \`${cards[0].wl}\` • ${showgen ? `\`${cards[0].gen}\` • ` : ""}**${cards[0].name}** • ${cards[0].series}\n` +
                `\`2]\` • ${Constants.WISH_EMOTE} \`${cards[1].wl}\` • ${showgen ? `\`${cards[1].gen}\` • ` : ""}**${cards[1].name}** • ${cards[1].series}\n` +
                `\`3]\` • ${Constants.WISH_EMOTE} \`${cards[2].wl}\` • ${showgen ? `\`${cards[2].gen}\` • ` : ""}**${cards[2].name}** • ${cards[2].series}\n` +
                `${pingme ? `<@${userid}>` : ""} ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
        }
    },
    /*2: {
        name: "Alternate",
        description: "Alternative algorithm, may be faster but may also lack in accuracy.",
        msg: (cards: any, ms: any, showgen: boolean, pingme: boolean, sdol: boolean, timegenerated: boolean, userid: any) => {
            return `\`1]\` • ${Constants.WISH_EMOTE} \`${cards[0].wl}\` • ${showgen ? `\`${cards[0].gen}\` • ` : ""}**${cards[0].name}** • ${cards[0].series}\n` +
                `\`2]\` • ${Constants.WISH_EMOTE} \`${cards[1].wl}\` • ${showgen ? `\`${cards[1].gen}\` • ` : ""}**${cards[1].name}** • ${cards[1].series}\n` +
                `\`3]\` • ${Constants.WISH_EMOTE} \`${cards[2].wl}\` • ${showgen ? `\`${cards[2].gen}\` • ` : ""}**${cards[2].name}** • ${cards[2].series}\n` +
                `${pingme ? `<@${userid}>` : ""} ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
        }
    },*/
    2: {
        name: "Basic",
        description: "For those who like it basic and plain.",
        msg: (cards, ms, showgen, pingme, sdol, timegenerated, userid) => {
            return `\`${cards[0].wl}\`${showgen ? ` • \`${cards[0].gen}\`` : ""}, \`${cards[1].wl}\`${showgen ? ` • \`${cards[1].gen}\`` : ""}, \`${cards[2].wl}\`${showgen ? ` • \`${cards[2].gen}\`` : ""}\n${pingme ? `<@${userid}>` : ""} ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
        }
    }
}

export async function updateConfigAnalysisMessage(interaction, isServer = false) {
    var analysis = await getConfigData("config.analysis", interaction.user.id, interaction.guildId, isServer);
    //var analysis: any = await db.get(`${interaction.user.id}.config.analysis`);
    //var serverAnalysis: any = await db.get(`${interaction.guild?.id}.config.analysis`);
    var u = (name, key, index) => {
        var foo = analysis[key];
        return `\`${index}]\` ${foo.data ? Constants.ON_EMOTE : Constants.OFF_EMOTE} • \`${name}\` • **${foo.data ? "Enabled" : "Disabled"}** ${foo.default ? "<Server Default>" : ""}`;
    }
    var type = analysisTypes[analysis.type.data];
    var embed = {
        title: isServer ? "Server Analysis Config" : undefined,
        author: isServer ? undefined : {
            name: "User Analysis Config",
            icon_url: interaction.user.avatarURL()
        },
        description: `${u("Analysis", "enabled", 1)}\n${u("Delete analysis after drop expires", "daade", 2)}\n${u("Show Gen", "showgen", 3)}\n${u("Ping me", "pingme", 4)}\n${u("Show description of Low", "sdol", 5)}\n${u("Show Time Generated", "timegenerated", 6)}\n${u("Show config button", "configbutton", 7)}\n${u("Show report button", "reportbutton", 8)}`,
        fields: [{
            name: "Message Type",
            value: `${analysis.type.data} / 2 \`[${type.name}]\`${isServer ? "" : analysis?.type.default ? " <Server Default>" : ""}${type.description ? `\n*${type.description}*` : ""}\n\n${type.msg(exampleCards, "1000", analysis.showgen.data, analysis.pingme.data, analysis.sdol.data, analysis.timegenerated.data, interaction.user.id)}`//"1 / 3 [Default] <Server Default>"
        }],
        thumbnail: {
            url: isServer ? interaction.guild?.iconURL() : ""
        },
        footer: {
            text: analysis.showgen.data ? "Showing Gen may increase the time generated." : ""
        },
        color: 2591285
    };
    if (analysis.enabled.data == false) {
        embed.description = `\`1]\`${Constants.OFF_EMOTE} • \`Analysis\` • **Disabled**${isServer ? "" : analysis?.enabled.default ? " <Server Default>" : ""}`;
        embed.fields = [];
        embed.footer = { text: "" };
    }
    var obj = {
        embeds: [embed],
        components: analysis.enabled.data ? [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder({
            customId: `configSelector_${isServer ? "server" : "user"}_` + Date.now()
        }).addOptions(
            {
                label: "Reminders",
                description: "Config of Reminders.",
                emoji: Constants.REMINDER_EMOTE_ID,
                value: "remindersOption"
            },
            {
                label: "Analysis",
                description: "Config of Analysis Messages, or types.",
                emoji: "🔍",
                value: `analysisOption`,
                default: true
            }
        )),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: "1",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_enabled_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "2",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_daade_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "3",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_showgen_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "4",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_pingme_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "5",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_sdol_` + Date.now(),
                style: ButtonStyle.Primary
            })
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: "6",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_timegenerated_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "7",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_configbutton_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: "8",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_reportbutton_` + Date.now(),
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                emoji: "1064158930705596416",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_navigateLeft`,
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                emoji: "1064158956353749122",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_navigateRight`,
                style: ButtonStyle.Primary
            })
        )
        ] : [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder({
            customId: `configSelector_${isServer ? "server" : "user"}_` + Date.now()
        }).addOptions(
            {
                label: "Reminders",
                description: "Config of Reminders.",
                emoji: Constants.REMINDER_EMOTE_ID,
                value: "remindersOption"
            },
            {
                label: "Analysis",
                description: "Config of Analysis Messages, or types.",
                emoji: "🔍",
                value: "analysisOption",
                default: true
            }
        )),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: "1",
                customId: `configToggle_analysis_${isServer ? "server" : "user"}_enabled_` + Date.now(),
                style: ButtonStyle.Primary
            }))]
    };
    if (isServer) obj.components[0].components[0].addOptions({
        label: "Utils",
        description: "Config of Utils.",
        emoji: "💡",
        value: "utilsOption"
    });
    if (interaction.isChatInputCommand()) return interaction.reply({ ephemeral: true, ...obj }).catch(_ => null);
    interaction.update(obj).catch(_ => null);
}

