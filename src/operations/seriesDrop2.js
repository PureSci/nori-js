import { Colors, Message } from "discord.js";
import sharp from "sharp";
import { cfl, recog, wo } from "../lib/index.js";
import { cardFind } from "../lib/cardFind.js";
import fetch from "node-fetch";
import { Constants } from "../lib/constants.js";

export default async (message) => {
    if (message.author.id == Constants.SOFI_BOT_ID && message.content == Constants.SERIES_DROP_PHASE_2) {
        if (message.attachments.size < 1) return;
        var startMs = Date.now();
        var imBuffer = await fetch(`${message.attachments.first()?.url}`);
        var im = sharp(Buffer.from(await imBuffer.arrayBuffer()));
        Promise.all([
            new Promise((resolve) => {
                im.clone().extract({ left: 26, top: 457, width: 287, height: 27 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
            }),
            new Promise((resolve) => {
                im.clone().extract({ left: 26, top: 486, width: 287, height: 27 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
            }),
            new Promise((resolve) => {
                im.clone().extract({ left: 379, top: 457, width: 287, height: 27 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
            }),
            new Promise((resolve) => {
                im.clone().extract({ left: 379, top: 486, width: 287, height: 27 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
            })
        ]).then((r) => {
            var cards = [
                cardFind(r[0], r[1]),
                cardFind(r[2], r[3])
            ];
            message.reply({
                content:
                    `\`1]\` • ${Constants.WISH_EMOTE} \`${cards[0] ? wo(cards[0].wl, 4) : Constants.LOW_TEXT}\` • **${cfl(r[0])}** • ${cfl(r[1])}\n` +
                    `\`2]\` • ${Constants.WISH_EMOTE} \`${cards[1] ? wo(cards[1].wl, 4) : Constants.LOW_TEXT}\` • **${cfl(r[2])}** • ${cfl(r[3])}\n` +
                    `${Constants.LOW_WL_TEXT} Took ${Date.now() - startMs}${Constants.MS_TO_PRODUCE}`,
            }).catch(_ => null);
        });
    }
}