const discord = require('discord.js');
const botInfo = require('./Bots_infos/BotPoll/infos');
const embed = require('./modules/Embed');
const fs = require('fs');

const bot = new discord.Client();

bot.login(botInfo.token);

require('./Bots_infos/BotPoll/saves/polls.json')



bot.on('ready', function () {
    console.log("\x1b[42m\x1b[30m" + bot.user.username + " is online" + "\x1b[0m");
});

bot.on("disconnect", function () {
    console.log("\x1b[45m\x1b[30m" + bot.user.username + " is offline" + "\x1b[0m");
    bot.destroy();
});

bot.on("error", function () {
    console.error(err);
    console.log("\x1b[45m\x1b[30m" + bot.user.username + " is offline (cause : error)" + "\x1b[0m");
    bot.destroy();
});

bot.on("messageReactionAdd", function (reaction, user, err) {
    if (err) throw err;
    fs.readFile('./Bots_infos/BotPoll/saves/polls.json', function (err, data) {
        let pollsJson = JSON.parse(data)
        if (pollsJson[reaction.message.id] !== null)
            //     console.log('react !')
            // else console.log('no react !')
            // console.log(pollsJson[reaction.message.id]);     # TODO -> make this work
    });
});

bot.on('message', function (msg) {
    let channel = bot.channels.cache.get(msg.channel.id);
    typedCommand = msg.content.split(" ")[0];

    switch (typedCommand) {
        // display an Embed showing possible commands
        case "!info":
            channel.send(embed.InfoEmbed(bot, botInfo, commandInfo));
            break;

        // start a poll
        case "!poll":
            let question = msg.content.replace("!poll ", "");
            question = question.replace(/\{(.*?)\}/g, "");

            let reactionEmoji = {};
            reactionEmoji[0] = "🇦";
            reactionEmoji[1] = "🇧"; reactionEmoji[4] = "🇪"; reactionEmoji[7] = "🇭";
            reactionEmoji[2] = "🇨"; reactionEmoji[5] = "🇫"; reactionEmoji[8] = "🇮";
            reactionEmoji[3] = "🇩"; reactionEmoji[6] = "🇬"; reactionEmoji[9] = "🇯";

            let args = [];
            if (msg.content.match(/\{(.*?)\}/g))
                args = /\{(.*?)\}/g.exec(msg.content)[1].split(';');

            if (question.includes("!poll") || args == "")
                msg.reply("wrong format. Here's an example : `!poll do you like me ? {yes;no;maybe}`");
            else if (args.length > 10)
                msg.reply("Please put less than 10 choices")
            else { // good format, send !
                channel.send(embed.PollEmbed(bot, msg.member.user.tag, question, args)).then(function (sentEmbed) {
                    for (let i = 0; i < args.length; i++) {
                        sentEmbed.react(reactionEmoji[i]);
                    }

                    fs.readFile('./Bots_infos/BotPoll/saves/polls.json', function (err, data) {
                        if (err) throw err;
                        let pollsJson = JSON.parse(data);
                        pollsJson['polls'].push({ [sentEmbed.id]: { question: question, args: args, votes: new Array(args.length).fill(0) } });
                        fs.writeFile("./Bots_infos/BotPoll/saves/polls.json", JSON.stringify(pollsJson), function (err) {
                            if (err) throw err;
                        });
                    });
                });
            }
            break;

        // ends the bot processus, only by the admin (not in !info)
        case "!end":
            if (msg.member.user.tag == botInfo.admin)
                bot.emit("disconnect");
            else
                msg.reply("You aren't allowed to disconnect me");
            break;

        // wrong command
        default:
            if (typedCommand[0] == '!')
                msg.reply("I don't know this command, type `!info` to display my commands");

    }
});

var commandInfo = {};
commandInfo["!info"] = "Display this message";
commandInfo["!poll"] = "Start a poll";
