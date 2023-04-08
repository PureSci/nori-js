import { Colors, Message } from "discord.js";
import { wo } from "../lib/index.js";
//import { characterData, seriesData } from "../lib/loadData.js";
import { get } from "../lib/initDB.js";
import { Constants } from "../lib/constants.js";

export default (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && message.embeds?.[0]?.description?.startsWith(Constants.SERIES_DROP_PHASE_1)) {
        var startMs = Date.now();
        var ser = message.embeds[0].description.split("\n");
        ser.pop();
        ser.shift();
        ser = ser.map((x) => x.split("]")[1].split("**")[0].trim());
        var arr = [];
        var seriesData = get(false);
        ser.forEach((rawSeries) => {
            var series = rawSeries.toLowerCase().replace(/\s/g, '').replace("...", "");
            arr.push(seriesData.data.find((rawDat) => {
                var rawSeriesDat = rawDat.series;
                var seriesDat = rawSeriesDat.toLowerCase().replace(/\s/g, '').replace("...", "");
                if (rawSeriesDat.endsWith("...") && rawSeries.endsWith("...")) {
                    if (seriesDat.length > series.length ? seriesDat.startsWith(series) : series.startsWith(seriesDat)) return true;
                    return false;
                } if (rawSeriesDat.endsWith("...") && (!rawSeries.endsWith("..."))) {
                    if (series.startsWith(seriesDat)) return true;
                    return false;
                } if ((!rawSeriesDat.endsWith("...")) && rawSeries.endsWith("...")) {
                    if (seriesDat.startsWith(series)) return true;
                    return false;
                } else {
                    if (seriesDat == series) return true;
                    return false;
                }
            }));
        });
        message.reply({
            content:
                `\`1]\` • ${Constants.WISH_EMOTE} \`${arr[0] ? wo(arr[0].wl, 4) : "0   "}\` • ${ser[0]}\n` +
                `\`2]\` • ${Constants.WISH_EMOTE} \`${arr[1] ? wo(arr[1].wl, 4) : "0   "}\` • ${ser[1]}\n` +
                `\`3]\` • ${Constants.WISH_EMOTE} \`${arr[2] ? wo(arr[2].wl, 4) : "0   "}\` • ${ser[2]}\n` +
                `${Constants.LOW_WL_TEXT} Took ${Date.now() - startMs}${Constants.MS_TO_PRODUCE}`
        }).catch(_ => null);
    }
}