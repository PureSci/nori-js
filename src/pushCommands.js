import { REST, Routes, Client } from 'discord.js';
import * as dotenv from 'dotenv';
import fs from "fs";
dotenv.config();
var client = new Client({
    intents: ["Guilds"]
});
var dev = false;

var commands = [];
var realfiles = [];
fs.readdirSync("./src/interactions/commands").forEach(x => {
    realfiles.push(`./interactions/commands/${x}`);
});
fs.readdirSync("./src/interactions/context").forEach(x => {
    realfiles.push(`./interactions/context/${x}`);
});
client.on("ready", () => {
    var i = 0;
    realfiles.forEach(async (file, index) => {
        commands.push((await import(file)).data.toJSON());
        i++;
        console.log(file, i, realfiles.length)
        if (i == realfiles.length) {
            console.log(commands);
            const rest = new REST({ version: '10' }).setToken(dev ? process.env.DEVTOKEN : process.env.TOKEN);

            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
    });
});

client.login(dev ? process.env.DEVTOKEN : process.env.TOKEN);
