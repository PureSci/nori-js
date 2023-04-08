//Attack the enemy guardians to deal damage
import { Message } from "discord.js";
import reminderHandler from "../../lib/reminderHandler.js";
import { Constants } from "../../lib/constants.js";
import { getConfigData } from "../../lib/index.js";

export default async (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && message.embeds?.[0]?.title == "GUILD: MINER" && message.embeds?.[0]?.description?.includes("from storage to vault")) {
        var userid = (await message.fetchReference().catch(_ => null))?.author?.id;
        if (!userid) return;
        var minerrem = await getConfigData("reminders.miner", userid, message.guildId);//await db.get(`${userid}.reminders.miner`);
        if (minerrem.data) reminderHandler(message, userid, "miner", message.channel.id, minerrem.data == "dm");
    }
}