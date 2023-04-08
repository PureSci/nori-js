import { ChannelType, Message } from "discord.js";
import { db } from "../index.js";
import { Constants } from "../lib/constants.js";
import { getConfigData } from "./index.js";
var timeouts = {};

export default (message, userid, type, channelId, isDM = false) => {
    if (timeouts[userid + type]) clearTimeout(timeouts[userid + type]);
    var duration = 480000;
    if (type == "grab") duration = 240000;
    else if (type == "raid") duration = 3600000;
    else if (type == "miner") duration = 86400000;
    var n = setTimeout(async () => {
        var al = await getConfigData(`reminders.${type}`, userid, message.guildId);
        if (!al.data) return;
        try {
            if (message?.channel?.type == ChannelType.DM) return;
            var perms = message.guild?.members.me?.permissionsIn(message.channel);
            if (perms?.has("SendMessages")) {
                var sendp = message.channel;
                if (al.data == "dm") sendp = message.author;
                sendp.send(`${Constants.REMINDER_EMOTE} <@${userid}> you can now **${type}**!${isDM ? ` <#${channelId}>` : ""}`).catch(_ => null);
            }
        } catch (err) { }
    }, duration);
    timeouts[userid + type] = n;
}