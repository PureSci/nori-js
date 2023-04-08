import { Client, ChannelType, ActivityType } from "discord.js";
import fs from "fs";
import { Database } from "quickmongo";
import * as dotenv from 'dotenv';
dotenv.config();
var dev = false;
const client = new Client({
    intents: [
        "Guilds",
        "MessageContent",
        "GuildMessages",
        "GuildIntegrations"
    ]
});
var commands = [];

var files = fs.readdirSync("./src/interactions/commands")

files.forEach(async (file) => {
    commands.push((await import(`./interactions/commands/${file}`)).data.toJSON());
});

const db = new Database(process.env.DBURL);
const initDB = () => new Promise(async (resolve, reject) => {
    db.once("ready", () => {
        resolve(db);
    });
    await db.connect();
});

await initDB();

export { db };

var operationArray = [];
var operationArrayEdit = [];
fs.readdirSync("./src/operations/").forEach(async file => {
    if (!file.endsWith("js")) return;
    operationArray.push(await import(`./operations/${file}`));
});
operationArrayEdit.push(await import("./operations/collect.js"))
fs.readdirSync("./src/operations/edit/").forEach(async file => {
    if (!file.endsWith("js")) return;
    operationArrayEdit.push(await import(`./operations/edit/${file}`));
});

var interactionArray = {
    buttons: [],
    modals: [],
    menus: [],
    commands: [],
    context: []
};

fs.readdirSync("./src/interactions/").forEach(f => {
    fs.readdirSync(`./src/interactions/${f}`).forEach(async file => {
        interactionArray[f].push(await import(`./interactions/${f}/${file}`));
    });
});
client.on("ready", () => {
    console.log("Bot ready");
    client.user?.setActivity(`${client.guilds.cache.size} servers | v0.2.5 Open Beta`, {
        type: ActivityType.Watching
    });
});
client.on("guildCreate", async (guild) => {
    var ch = client.channels.cache.get("1066400592831975505");
    if (ch?.type == ChannelType.GuildText) {
        ch?.send(`Nori joined a server...\nCurrent Capacity: \`${client.guilds.cache.size} / 250\``);
    }
    console.log("Joined New Guild! " + guild.name);
    client.user?.setActivity(`${client.guilds.cache.size} servers | v0.2.5 Open Beta`, {
        type: ActivityType.Watching
    });
});

client.on("guildDelete", async (guild) => {
    var ch = client.channels.cache.get("1066400592831975505");
    if (ch?.type == ChannelType.GuildText) {
        ch?.send(`<@&1066399009620639814> nori left a server!!! Be quick to add it to your server.\nCurrent Capacity: \`${client.guilds.cache.size} / 250\``).catch(_ => null);
    }
});
//process.on("uncaughtException", () => { });
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        interactionArray["buttons"].forEach((x) => {
            x.default(interaction);
        });
    } else if (interaction.isModalSubmit()) {
        interactionArray["modals"].forEach((x) => {
            x.default(interaction);
        });
    } else if (interaction.isStringSelectMenu()) {
        interactionArray["menus"].forEach((x) => {
            x.default(interaction);
        });
    } else if (interaction.isChatInputCommand()) {
        interactionArray["commands"].forEach((x) => {
            x.default(interaction);
        });
    } else if (interaction.isMessageContextMenuCommand()) {
        interactionArray["context"].forEach((x) => {
            x.default(interaction);
        });
    }
});

client.on("messageCreate", async (message) => {
    if (message.channel.type == ChannelType.DM) return;
    var perms = message.guild?.members.me?.permissionsIn(message.channel);
    if (perms?.has("SendMessages") && perms?.has("EmbedLinks")) operationArray.forEach(x => {
        x.default(message);
    });
});

client.on("messageUpdate", (om, message) => {
    if (message.channel.type == ChannelType.DM) return;
    var perms = message.guild?.members.me?.permissionsIn(message.channel);
    if (perms?.has("SendMessages") && perms?.has("EmbedLinks")) operationArrayEdit.forEach(x => {
        x.default(message);
    });
});

function f(text) {
    return {
        wl: parseInt(text.split("> `")[1].split("`")[0].trim()),
        name: text.split("**")[1].split("**")[0],
        series: text.split("** • *")[1].split("*")[0]
    }
}

client.login(dev ? process.env.DEVTOKEN : process.env.TOKEN);