import tesseract from "node-tesseract-ocr";
import { db } from "../index.js";

export function cfl(s) {
    try {
        var p = [];
        s.split(" ").forEach(x => {
            p.push(x.charAt(0).toUpperCase() + x.slice(1));
        });
        return p.join(" ");
    } catch (err) { return "undefined" }
}

export async function recog(buffer) {
    return (await tesseract.recognize(buffer, {
        psm: 7
    })).trim().toLowerCase().replace("'", "");
}

export function wo(lo, ro) {
    if (typeof lo == "number") lo = lo.toString();
    if (lo.length >= ro) return lo;
    while (lo.length !== ro) {
        lo += " ";
    }
    return lo;
}

const defaultData = JSON.stringify({
    "reminders": {
        "drop": true,
        "grab": false,
        "raid": true,
        "miner": true
    },
    "config": {
        "analysis": {
            "enabled": true,
            "type": 1,
            "daade": false,
            "showgen": false,
            "pingme": true,
            "sdol": true,
            "timegenerated": true,
            "configbutton": true,
            "reportbutton": true
        },
        "servers": {
            "minigame": {
                "enabled": true,
                "timegenerated": true,
                "sdol": true
            }
        },
        "utils": {
            "deletemessage": false
        }
    }
});

export function getConfigData(query, userid, guildid, isServer = false) {
    return new Promise(async (resolve, reject) => {
        var def = false;
        var result = await db.get((isServer ? guildid : userid) + "." + query);
        if (result === null || result === undefined) {
            def = true;
            result = await db.get(guildid + "." + query);
        }
        if (result === null || result === undefined) {
            result = JSON.parse(defaultData);
            var splitted = query.split(".");
            splitted.forEach(x => {
                result = result[x];
            });
            if (typeof result === "object") {
                Object.keys(result).forEach(x => {
                    result[x] = {
                        data: result[x],
                        default: isServer ? false : true
                    }
                });
                resolve(result);
            } else resolve({
                data: result,
                default: isServer ? false : true
            });
        } else if (typeof result === "object") {
            var l = JSON.parse(defaultData);
            var splitted = query.split(".");
            splitted.forEach(x => {
                l = l[x];
            });
            var guildData = await db.get(guildid + "." + query);
            Object.keys(l).forEach(x => {
                if (result[x] == null || result[x] == undefined) {
                    result[x] = {
                        data: guildData?.[x] !== null && guildData?.[x] !== undefined ? guildData[x] : l[x],
                        default: isServer ? false : true
                    };
                } else {
                    result[x] = {
                        data: result[x],
                        default: isServer ? false : false
                    }
                }
            })
            resolve(result);
        } else resolve({
            data: result,
            default: isServer ? false : def
        });
    });
}