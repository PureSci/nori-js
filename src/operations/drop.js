import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, Message } from "discord.js";
import sharp from "sharp";
import fetch from "node-fetch";
import { recog, cfl, wo, getConfigData } from "../lib/index.js";
import reminderHandler from "../lib/reminderHandler.js";
import { cardFind } from "../lib/cardFind.js";
import { Constants } from "../lib/constants.js";
import { analysisTypes } from "../interactions/buttons/configToggle.js";
//import { exec } from "child_process";
export default async (message) => {
    if ((message.author.id == Constants.SOFI_BOT_ID && message.content.endsWith(Constants.DROP_CARDS)) || (message.author.id == Constants.SOFI_BOT_ID && message.content?.includes(Constants.EXTRA_DROP)) || (message.author.id == Constants.PURE_ID && message.content == "foo" && message.attachments.size > 0)) {
        var startMs = Date.now();
        var userid = message.content?.split("<@")?.[1]?.split(">")?.[0];
        if ((!userid) && message.content == "foo") userid = Constants.PURE_ID;
        var enabled = await getConfigData(`config.analysis.enabled`, userid, message.guildId);
        if (!enabled.data) return;
        if (message.attachments.size > 0) {
            var imBuffer = await fetch(`${message.attachments.first()?.url}`);
            var im = sharp(Buffer.from(await imBuffer.arrayBuffer()));
            Promise.all([
                new Promise((resolve) => {
                    im.clone().extract({ left: 12, top: 458, width: 281, height: 26 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
                }),
                new Promise((resolve) => {
                    im.clone().extract({ left: 12, top: 487, width: 281, height: 26 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
                }),
                new Promise((resolve) => {
                    im.clone().extract({ left: 361, top: 458, width: 281, height: 26 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
                }),
                new Promise((resolve) => {
                    im.clone().extract({ left: 361, top: 487, width: 281, height: 26 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
                }),
                new Promise((resolve) => {
                    im.clone().extract({ left: 704, top: 458, width: 281, height: 26 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
                }),
                new Promise((resolve) => {
                    im.clone().extract({ left: 704, top: 487, width: 281, height: 26 }).greyscale().linear(3).extend({ left: 7, right: 7, top: 7, bottom: 7, background: "white" }).toBuffer().then(buffer => { recog(buffer).then(r => { resolve(r) }) });
                })
            ]).then(r => {
                var cards = [
                    cardFind(r[0], r[1]),
                    cardFind(r[2], r[3]),
                    cardFind(r[4], r[5])
                ]
                handleReply(message, cards, startMs, r);
            });
            /* var showgen = await getConfigData("config.analysis.showgen", userid, message.guildId);
             //${showgen.data ? " true" : ""}
             exec(`~/pure/nb ${message.attachments.first()?.url}${showgen.data ? " true" : ""}`, (err, stdout, stderr) => {
                 try {
                     var r = stdout.split("AORARRAY=")[1].split("\n");
                     r = r.map(x => x.trim().toLowerCase().replace("'", ""));
                     var cards = [
                         cardFind(r[0], r[1]),
                         cardFind(r[2], r[3]),
                         cardFind(r[4], r[5])
                     ];
                     handleReply(message, cards, startMs, r);
                 } catch (e) { }
             });*/
        } else {
            var l = (s) => message.embeds?.[0]?.fields?.[s]?.value.split("\n\n").map(x => x.replace("```", "").replace("\n", "").trim().toLowerCase());
            var n = [l(0), l(1), l(2)].flat();
            var f = (m) => m.endsWith("-") ? m.substring(0, m.length - 1).concat("...") : m;
            var cards = [
                cardFind(f(n[0]), f(n[1])),
                cardFind(f(n[2]), f(n[3])),
                cardFind(f(n[4]), f(n[5]))
            ];
            var showgen = await getConfigData("config.analysis.showgen", userid, message.guildId);
            if (showgen.data) message.embeds?.[0]?.fields?.map(x => x.name.split("Gen")[1]?.trim()).forEach(x => n.push(`ɢ${x}`));
            handleReply(message, cards, startMs, n);
        }
    }
}



async function handleReply(message, cards, startMs, r) {
    var userid = message.content?.split("<@")?.[1]?.split(">")?.[0];
    if ((!userid) && message.content == "foo") userid = Constants.PURE_ID;
    var droprem = await getConfigData("reminders.drop", userid, message.guildId);
    if (droprem.data && !message.content?.includes(Constants.EXTRA_DROP)) reminderHandler(message, userid, "drop", message.channel.id, droprem.data == "dm");
    var analysis = await getConfigData("config.analysis", userid, message.guildId);
    var row = new ActionRowBuilder();
    if (analysis.configbutton.data) row.addComponents(new ButtonBuilder({
        customId: `configButton_${userid}_${Date.now()}`,
        label: "Config",
        style: ButtonStyle.Primary,
        emoji: "1064239447257927760"//"1064239447257927760"
    }));
    if (analysis.reportbutton.data) row.addComponents(new ButtonBuilder({
        customId: `reportError_${userid}_${message.channel.id}_${message.id}`,
        label: "Report This",
        style: ButtonStyle.Danger
    }));
    //console.log(analysis, userid, message.guildId);
    //if (typeof analysis.type.data == "object") analysis.type.data = analysis.type.data.data;
    /*var no = (num) => {
        r[num] = r[num].replace("g", "");
        for (let i = 0; i < r[num].length - 1; i++) {
            if (r[num][i] == "/" && r[num][i+1] && r[num][i+1] == "7") {
                newnum +=
            }
            else if (r[num][i] == "/") 
        }
        wo(r[num].replace("g", "ɢ"), 5);
    }*/
    message.reply({
        content: analysisTypes[analysis.type.data].msg([
            { wl: cards[0] ? wo(cards[0].wl, 4) : Constants.LOW_TEXT, name: cfl(r[0]), series: cfl(r[1]), gen: r[6] ? wo(r[6].replace("g", "ɢ"), 5) : undefined },
            { wl: cards[1] ? wo(cards[1].wl, 4) : Constants.LOW_TEXT, name: cfl(r[2]), series: cfl(r[3]), gen: r[7] ? wo(r[7].replace("g", "ɢ"), 5) : undefined },
            { wl: cards[2] ? wo(cards[2].wl, 4) : Constants.LOW_TEXT, name: cfl(r[4]), series: cfl(r[5]), gen: r[8] ? wo(r[8].replace("g", "ɢ"), 5) : undefined }
        ], Date.now() - startMs, analysis.showgen.data, analysis.pingme.data, analysis.sdol.data, analysis.timegenerated.data, userid),
        components: row.components.length !== 0 ? [row] : []
    }).then(async m => {
        if (analysis.daade.data && m.deletable) setTimeout(() => m.delete().catch(_ => null), 60000);
    }).catch(_ => null);
}