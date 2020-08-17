const discord = require('discord.js');
const botInfo = require('./Bots_infos/BotPoll/infos');
const embed = require('./modules/Embed');
const fs = require('fs');
const bot = new discord.Client();

bot.login(botInfo.token);


bot.on('ready', function () {
    console.log("\x1b[42m\x1b[30m" + bot.user.username + " is online" + "\x1b[0m");
    bot.user.setActivity("type !info to show help");
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
        let pollsJson = JSON.parse(data);
        let targetPoll = pollsJson.polls.find(poll => poll.msgId === reaction.message.id);

        if (targetPoll !== undefined && user.id != bot.user.id && (!targetPoll.alreadyVoted.includes(user.tag))) {
            for (let i = 0; i < targetPoll.args.length; i++) {
                if (reaction.emoji.name == reactionEmoji[i])
                    targetPoll.votes[i] += 1
            }
            targetPoll.alreadyVoted.push(user.tag);

            fs.writeFile("./Bots_infos/BotPoll/saves/polls.json", JSON.stringify(pollsJson), function (err) {
                if (err) throw err;
            });
        }
    });
});

bot.on('message', function (msg) {
    let channel = bot.channels.cache.get(msg.channel.id);
    typedCommand = msg.content.split(" ")[0];

    if (typedCommand[0] == '!')
        commandTrigger(bot, botInfo, channel, msg, typedCommand);
});

function commandTrigger(bot, botInfo, channel, msg, typedCommand) {
    switch (typedCommand) {
        // display an Embed showing possible commands
        case "!info":
            channel.send(embed.InfoEmbed(bot, botInfo, commandInfo));
            break;

        // start a poll
        case "!poll":
            let question = msg.content.replace("!poll ", "");
            question = question.replace(/\{(.*?)\}/g, "");

            let args = [];
            if (msg.content.match(/\{(.*?)\}/g))
                args = /\{(.*?)\}/g.exec(msg.content)[1].split(';');

            if (question.includes("!poll") || args == "")
                msg.reply("format : `!poll question {choice1;choice2;...}`. For example : `!poll do you like me ? {yes;no;maybe}`");
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
                        pollsJson['polls'].push({ msgId: sentEmbed.id, question: question, args: args, votes: new Array(args.length).fill(0), alreadyVoted: [] });
                        fs.writeFile("./Bots_infos/BotPoll/saves/polls.json", JSON.stringify(pollsJson), function (err) {
                            if (err) throw err;
                        });
                    });

                    setTimeout(function () {
                        fs.readFile('./Bots_infos/BotPoll/saves/polls.json', function (err, data) {
                            if (err) throw err;
                            let pollsJson = JSON.parse(data);
                            let targetPoll = pollsJson.polls.find(poll => poll.msgId === sentEmbed.id);
                            channel.send(embed.resultPollEmbed(bot, msg.member.user.tag, question, args, targetPoll.votes));
                        });
                    }, 300000);
                });

            }
            break;

        // ends the bot processus, only by the admin (not in !info)
        case "!end":
            if (msg.member.hasPermission("ADMINISTRATOR"))
                bot.emit("disconnect");
            break;

        // wrong command
        default:
            if (typedCommand[0] == '!')
                msg.reply("I don't know this command, type `!info` to display my commands");

    }
}


var commandInfo = {};
commandInfo["!info"] = "Display this message";
commandInfo["!poll"] = "Start a poll";


var reactionEmoji = {};
reactionEmoji[0] = "🇦";
reactionEmoji[1] = "🇧"; reactionEmoji[4] = "🇪"; reactionEmoji[7] = "🇭";
reactionEmoji[2] = "🇨"; reactionEmoji[5] = "🇫"; reactionEmoji[8] = "🇮";
reactionEmoji[3] = "🇩"; reactionEmoji[6] = "🇬"; reactionEmoji[9] = "🇯";