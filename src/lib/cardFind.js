//import { characterData } from "./loadData.js";
import { get } from "./initDB.js";
var badOcrList = [
    {
        type: "name",
        wrong: "Sangonomivya K...",
        right: "Sangonomiya K..."
    },
    {
        type: "name",
        wrong: "Sangonomitya K...",
        right: "Sangonomiya K..."
    },
    {
        type: "name",
        wrong: "Donquixote Ho...",
        right: "Donquixote Homing"
    },
    {
        type: "series",
        wrong: "Date Alive Ill",
        right: "Date A Live III"
    },
    {
        type: "series",
        wrong: "Danganronmpa.: ...",
        right: "Danganronpa: ..."
    },
    {
        type: "name",
        wrong: "Yvukihana Lamy",
        right: "Yukihana Lamy"
    },
    {
        type: "name",
        wrong: "C.-",
        right: "C.C."
    }, {
        type: "name",
        wrong: "Vv",
        right: "V"
    },
    {
        type: "series",
        wrong: "Danganronpa. ...",
        right: "Danganronpa: ..."
    },
    {
        type: "name",
        wrong: "Yual",
        right: "Yuqi"
    },
    {
        type: "name",
        wrong: "Qial",
        right: "Qiqi"
    },
    {
        type: "name",
        wrong: "Qlal",
        right: "Qiqi"
    },
    {
        type: "series",
        wrong: "Haikyu!",
        right: "Haikyu!!"
    }
];
export function delChar(str, index) {
    return str.slice(0, index) + str.slice(index + 1);
}
export function cardFind(cardName, cardSeries, z = false) {
    var characterData = get();
    var badOcr = badOcrList.find(x => x.wrong.toLowerCase().replace(/\s/g, '') == (x.type == "name" ? cardName.toLowerCase().replace(/\s/g, '') : cardSeries.toLowerCase().replace(/\s/g, '')));
    if (badOcr) {
        if (badOcr.type == "name") cardName = badOcr.right;
        else cardSeries = badOcr.right;
    }
    var rawName = cardName, rawSeries = cardSeries;
    if (cardName.endsWith("..") && cardName[cardName.length - 3] !== ".") cardName += ".";
    if (cardSeries.endsWith("..") && cardSeries[cardSeries.length - 3] !== ".") cardSeries += ".";
    var isDotName = cardName.endsWith("...");
    var isDotSeries = cardSeries.endsWith("...");
    cardName = cardName.toLowerCase().replace(/\s/g, '').replace("...", "");
    if (cardName == "herrscherof") {
        var u = characterData.data.filter(x => x.name.startsWith("herrscherof"));
        u.sort((a, b) => a.wl - b.wl);
        return { wl: `${u[0].wl} - ${u[u.length - 1].wl}` };
    }
    cardSeries = cardSeries.toLowerCase().replace(/\s/g, '').replace("...", "");
    var m = characterData.data.find(character => {
        var func = (cardName, characterName, isDot) => {
            if (characterName.includes("★")) characterName = characterName.replace("★", "");
            var miss = 0;
            var a = cardName;
            var isDotChar = characterName.endsWith("...");
            characterName = characterName.replace("...", "");
            var cn = cardName, chn = characterName;
            var deletedChar = [];
            if (cardName.length > characterName.length) a = characterName;
            for (let i = 0; i < a.length; i++) {
                if (!(cn[i] == chn[i])) {
                    cardName = delChar(cardName, i);
                    characterName = delChar(characterName, i);
                    deletedChar.push(cn[i]);
                    deletedChar.push(chn[i]);
                    miss++;
                }
            }
            if (miss > 1) return false;
            if (miss !== 0) { if (!(miss == 1 && (deletedChar.includes("|") || deletedChar.includes("’") || (deletedChar.includes("o") && deletedChar.includes("0")) || (deletedChar.includes("l") && deletedChar.includes("i")) || ((deletedChar.includes("1") && deletedChar.includes("]")) || ((deletedChar.includes("y") && deletedChar.includes("v")) || (deletedChar.includes("$") && deletedChar.includes("s")) || (deletedChar.includes("i") && deletedChar.includes("l"))) || (deletedChar.includes("i") && deletedChar.includes("!")) || (deletedChar.includes("s") && deletedChar.includes("5")) || (deletedChar.includes("©") && deletedChar.includes("o")) || (deletedChar.includes("1") && deletedChar.includes("i")) || (deletedChar.includes("a") && deletedChar.includes("é")))))) return false; }
            if (isDot && isDotChar) {
                if (a == cn ? characterName.startsWith(cardName) : cardName.startsWith(characterName)) return true;
                return false;
            } else if (isDot && !isDotChar) {
                if (characterName == cardName) return false; // can cause problems
                if (characterName.startsWith(cardName)) return true;
                return false;
            } else if ((!isDot) && isDotChar) {
                if (cardName.startsWith(characterName)) return true;
                return false;
            } else {
                if (cardName == characterName) return true;
                return false;
            }
        }
        if (func(cardName, character.name, isDotName) && func(cardSeries, character.series, isDotSeries)) return true;
        return false;
    });
    if ((!m) && (cardName.endsWith(".") || cardSeries.endsWith(".")) && (isDotName || isDotSeries) && !z) {
        if (cardName.endsWith(".") && isDotName) return cardFind(cardName.replace(".", ":"), rawSeries, true);
        if (cardSeries.endsWith(".") && isDotSeries) return cardFind(rawName, rawSeries.replace(".", ":"), true);
    }
    if ((!m) && (cardName.endsWith(".") || cardSeries.endsWith("."))) {
        if (cardName.endsWith(".")) return cardFind(rawName.slice(0, -1), rawSeries);
        if (cardSeries.endsWith(".")) return cardFind(rawName, rawSeries.slice(0, -1));
    }
    if ((!m) && (cardName.includes(".:") || cardSeries.includes(".:"))) {
        if (cardName.includes(".:")) return cardFind(rawName.replace(".:", ":"), rawSeries);
        if (cardSeries.includes(".:")) return cardFind(rawName, rawSeries.replace(".:", ":"));
    }
    if ((!m) && (cardName.includes(".-") || cardSeries.includes(".-"))) {
        if (cardName.includes(".-")) return cardFind(rawName.replace(".-", ":"), rawSeries);
        if (cardSeries.includes(".-")) return cardFind(rawName, rawSeries.replace(".-", ":"));
    }
    return m;
}