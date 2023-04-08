import chardb from "../data/characters_db.json" assert {type: "json"};
import seriesdb from "../data/series_db.json" assert {type: "json"};
import glowsdb from "../data/glows_db.json" assert {type: "json"};
import fs from "fs";

export function getGlow(code) {
    return glowsdb[code];
}

export function pushGlow(code, data) {
    glowsdb[code] = data;
}

export function get(isChar = true) {
    if (!isChar) return seriesdb;
    return chardb;
}

export function push(value, isChar = true) {
    var db = isChar ? chardb : seriesdb;
    Object.keys(value).forEach(x => {
        if (typeof value[x] == "number") return;
        value[x] = value[x].toLowerCase().replace(/\s/g, '').replace("'", "").replace("’", "");
    });
    var as = db.data.find(x => (isChar ? x.name == value.name : true) && x.series == value.series);
    var index;
    if (as) index = db.data.indexOf(as);
    if (index && index > -1) return db.data[index] = value;
    db.data.push(value);
}

setInterval(() => {
    fs.writeFileSync("./src/data/characters_db.json", JSON.stringify(chardb));
    fs.writeFileSync("./src/data/series_db.json", JSON.stringify(seriesdb));
    fs.writeFileSync("./src/data/glows_db.json", JSON.stringify(glowsdb));
}, 3 * 60000);