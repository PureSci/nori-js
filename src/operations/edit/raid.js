//Attack the enemy guardians to deal damage
import { Message } from "discord.js";
import reminderHandler from "../../lib/reminderHandler.js";
import { Constants } from "../../lib/constants.js";
import { getConfigData } from "../../lib/index.js";

export default async (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && message.embeds?.[0]?.description?.includes(Constants.RAID_MSG)) {
        var userid = (await message.fetchReference().catch(_ => null)).author.id;
        if (!userid) return;
        var raidrem = await getConfigData("reminders.raid", userid, message.guildId);
        if (raidrem.data) reminderHandler(message, userid, "raid", message.channel.id, raidrem.data == "dm");
    }
}