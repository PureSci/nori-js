import { Message } from "discord.js";
import reminderHandler from "../lib/reminderHandler.js";
import { Constants } from "../lib/constants.js";
import { getConfigData } from "../lib/index.js";

export default async (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && (message.content.includes(Constants.BATTLED_TEXT) || message.content.includes(Constants.TOOK_CARD))) {
        var userid;
        if (message.content.includes(Constants.BATTLED_TEXT)) userid = message.content.split(Constants.BATTLED_TEXT)[0].split("<@")[1].split(">")[0];
        else userid = message.content.split("<@")[1].split(">")[0];
        var grabrem = await getConfigData("reminders.grab", userid, message.guildId)
        if (grabrem.data) reminderHandler(message, userid, "grab", message.channel.id, grabrem.data == "dm");
    }
}