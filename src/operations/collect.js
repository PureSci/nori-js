import { Colors, Message } from "discord.js";
import { push, get } from "../lib/initDB.js";
/**@param {Message} message */
export default async (message) => {
    if (message.author.id !== "853629533855809596") return;
    if (message.embeds?.[0]?.title == "LOOKUP") {
        var d = message.embeds[0].description?.split("\n").filter(x => ["**`Wishlisted", "**Series", "**Name"].some(y => x.startsWith(y)));
        push({
            wl: parseInt(d[2].split("➜** `")[1].split("`")[0].trim()),
            name: d[1].split(": ** ")[1].trim(),
            series: d[0].split(": ** ")[1].trim()
        });
    } else if (message.embeds?.[0]?.description?.includes("Cards Collected:")) {
        var d = message.embeds[0].fields[0].value.split("\n");
        var series = message.embeds[0].description.split("__**")[1].split("**__")[0].trim();
        d.forEach(x => {
            push({
                wl: parseInt(x.split("❤️ `")[1].split("`")[0].trim()),
                name: x.split("**")[1].split("**")[0].trim(),
                series: series
            });
        });
        push({
            wl: parseInt(message.embeds[0].description.split("*Total Wishlist:* **")[1].split("**")[0].trim()),
            series: series
        }, false);
    } else if (message.embeds?.[0]?.title?.includes("(Sort By: Wishlist)")) {
        var d = message.embeds[0].description.split("\n");
        d.forEach(x => {
            push({
                wl: parseInt(x.split("> `")[1].split("`")[0].trim()),
                name: x.split("**")[1].split("**")[0].trim(),
                series: x.split("•  *")[1].split("*")[0].trim()
            });
        });
    } else if (message.embeds?.[0]?.title?.includes("__Characters Lookup__") || message.embeds?.[0]?.title?.includes("Add to wishlist")) {
        var d = message.embeds[0].description.split("\n");
        d.forEach(x => {
            push({
                wl: parseInt(x.split("`❤️ ")[1].split("`")[0].trim()),
                name: x.split("` •  **")[1].split("**")[0].trim(),
                series: x.split("• *")[1].split("*")[0].trim()
            });
        });
    } else if (message.embeds?.[0]?.title?.includes("SERIES")) {
        var d = message.embeds[0].description.split("\n");
        d.forEach(x => {
            if(!x.split("❤️ `")[1]) return;
            push({
                wl: parseInt(x.split("❤️ `")[1].split("`")[0].trim()),
                series: x.split("**")[1].split("**")[0].trim()
            }, false);
        });
    }
}