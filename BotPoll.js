const discord = require('discord.js');
const botInfo = require('./Bots_infos/BotPoll/infos');
const embed = require('./modules/Embed');
const bot = new discord.Client();

bot.login(botInfo.token);

bot.on('ready', function () {
    console.log("\x1b[42m\x1b[30m" + bot.user.username + " is online" + "\x1b[0m");
});

bot.on("disconnect", function () {
    console.log("\x1b[45m\x1b[30m" + bot.user.username + " is offline" + "\x1b[0m");
    bot.destroy();
});

bot.on("error", function (err) {
    console.error(err);
    console.log("\x1b[45m\x1b[30m" + bot.user.username + " is offline (cause : error)" + "\x1b[0m");
    bot.destroy();
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

            let args = "";
            if (msg.content.match(/\{(.*?)\}/g))
                args = /\{(.*?)\}/g.exec(msg.content)[1].split(';');

            if (question.includes("!poll") || args == "")
                msg.reply("wrong format. Here's an example : `!poll do you like me ? {yes;no;maybe}`");
            else if (args.length > 10)
                msg.reply("Please put less choices than 10")
            else {
                channel.send(embed.PollEmbed(bot, msg.member.user.tag, question, args)).then(function (sentEmbed) {
                    for (let i = 0; i < args.length; i++) {
                        sentEmbed.react(reactionEmoji[i]);
                    }
                });
            }
            break;

        // ends the bot processus, only by the admin (hidden in !info)
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