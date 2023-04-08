import { Colors, Message } from "discord.js";
import { cardFind } from "../lib/cardFind.js";
import { cfl, wo } from "../lib/index.js";
import { Constants } from "../lib/constants.js";

export default (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && message.embeds?.[0]?.title?.includes(Constants.MINIGAME_TRIGGER)) {
        var startMs = Date.now();
        var series = message.embeds[0].description?.split("*(")[1].split(")*")[0];
        var name = message.embeds[0].description?.split("**")[1].split("**")[0];
        var card = cardFind(name, series);
        message.reply({
            content:
                `\`1]\` • ${Constants.WISH_EMOTE} \`${card ? wo(card.wl, 4) : Constants.LOW_TEXT}\` • **${cfl(message.embeds[0].description?.split("**")[1].split("**")[0])}** • ${cfl(message.embeds[0].description?.split("** *")[1].split("*")[0])}\n` +
                `${card ? "" : `${Constants.LOW_WL_TEXT} `}Took ${Date.now() - startMs}${Constants.MS_TO_PRODUCE}`
        }).catch(_ => null);
    }
}