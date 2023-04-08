import { Colors, Message } from "discord.js";
import sharp from "sharp";
import fetch from "node-fetch";
import { recog, cfl, wo } from "../lib/index.js";
import { cardFind } from "../lib/cardFind.js";
import { Constants } from "../lib/constants.js";

export default async (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && message.embeds?.[0]?.title == Constants.CAPTCHA_DROP) {
        var startMs = Date.now();
        var imBuffer = await fetch(`${message.embeds[0].image?.url}`);
        var im = sharp(Buffer.from(await imBuffer.arrayBuffer()));
        Promise.all([
            new Promise((resolve) => {
                im.clone().extract({ left: 17, top: 460, width: 290, height: 27 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
            }),
            new Promise((resolve) => {
                im.clone().extract({ left: 17, top: 488, width: 290, height: 27 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
            })
        ]).then((r) => {
            var card = cardFind(r[0], r[1]);
            message.reply({
                content:
                    `\`1]\` • ${Constants.WISH_EMOTE} \`${card ? wo(card.wl, 4) : Constants.LOW_TEXT}\` • **${cfl(r[0])}** • ${cfl(r[1])}\n` +
                    `${card ? "" : `${Constants.LOW_WL_TEXT} `}Took ${Date.now() - startMs}${Constants.MS_TO_PRODUCE}`
            }).catch(_ => null);
        })
    }
}