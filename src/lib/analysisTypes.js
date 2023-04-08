import { Constants } from "./constants.js";
import { wo } from "./index.js";

export const analysisTypeDrop = {
    1: {
        name: "Default",
        description: undefined,
        msg: (cards, ms, showgen, pingme, sdol, timegenerated, userid) => {

            //idea - need testing but may work?
            return `\`1]\` • ${Constants.WISH_EMOTE} \`${cards[0].wl}\` • ${showgen ? `\`${cards[0].gen}\` • ` : ""}**${cards[0].name}** • ${cards[0].series}\n` +
                `${cards[1] ? `\`2]\` • ${Constants.WISH_EMOTE} \`${cards[1].wl}\` • ${showgen ? `\`${cards[1].gen}\` • ` : ""}**${cards[1].name}** • ${cards[1].series}\n` : ""}` +
                `${cards[2] ? `\`3]\` • ${Constants.WISH_EMOTE} \`${cards[2].wl}\` • ${showgen ? `\`${cards[2].gen}\` • ` : ""}**${cards[2].name}** • ${cards[2].series}\n` : ""}` +
                `${pingme ? `<@${userid}>` : ""} ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`


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
            //idea - need testing but may work?
            return `\`${cards[0].wl}\`${showgen ? ` • \`${cards[0].gen}\`` : ""}, ${cards[1] ? `\`${cards[1].wl}\`${showgen ? ` • \`${cards[1].gen}\`` : ""},` : ""} ${cards[2] ? `\`${cards[2].wl}\`${showgen ? ` • \`${cards[0].gen}\`` : ""}` : ""}\n${pingme ? `<@${userid}>` : ""} ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
            return `\`${cards[0].wl}\`${showgen ? ` • \`${cards[0].gen}\`` : ""}, \`${cards[1].wl}\`${showgen ? ` • \`${cards[1].gen}\`` : ""}, \`${cards[2].wl}\`${showgen ? ` • \`${cards[0].gen}\`` : ""}\n${pingme ? `<@${userid}>` : ""} ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
        }
    }
}

export const analysisTypeSeries = {
    1: {
        name: "Default",
        description: undefined,
        msg: (arr, ms, sdol, timegenerated, series) => {
            return `\`1]\` • ${Constants.WISH_EMOTE} \`${arr[0] ? wo(arr[0].wl, 4) : "0   "}\` • ${series[0]}\n` +
                `\`2]\` • ${Constants.WISH_EMOTE} \`${arr[1] ? wo(arr[1].wl, 4) : "0   "}\` • ${series[1]}\n` +
                `\`3]\` • ${Constants.WISH_EMOTE} \`${arr[2] ? wo(arr[2].wl, 4) : "0   "}\` • ${series[2]}\n` +
                `${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
        }
    },

    2: {
        name: "Basic",
        description: "For those who like it basic and plain.",
        msg: (arr, ms, sdol, timegenerated, series) => {
            return `\`${arr[0].wl}\` • \`${series[0]}\` \`${arr[1].wl}\` • \`${series[1]}\` \`${arr[2].wl}\` • \`${series[2]}\` \n ${sdol ? Constants.LOW_WL_TEXT : ""} ${timegenerated ? `Took ${ms}${Constants.MS_TO_PRODUCE}` : ""}`
        }
    }
}