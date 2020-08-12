const discord = require('discord.js');
const botInfo = require('./Bots_infos/BotPoll/infos');
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
        case "!info":
            channel.send(InfoEmbed(bot, commandInfo));
            break;

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
                channel.send(PollEmbed(bot, msg.member.user.tag, question, args)).then(function (sentEmbed) {
                    for (let i = 0; i < args.length; i++) {
                        sentEmbed.react(reactionEmoji[i]);
                    }
                });
            }
            break;

        case "!end":
            if (msg.member.user.tag == botInfo.admin)
                bot.emit("disconnect");
            else
                msg.reply("You aren't allowed to disconnect me");
            break;

        default:
            if (typedCommand[0] == '!')
                msg.reply("I don't know this command, type `!info` to display my commands");

    }
});

var commandInfo = {};
commandInfo["!info"] = "Display this message";
commandInfo["!poll"] = "Start a poll";


function PollEmbed(bot, user, question, args) {
    let resultString = '';
    for (let i = 0; i < args.length; i++) {
        resultString += ":regional_indicator_" + String.fromCharCode(96 + i + 1) + ": : " + args[i] + "\n";

    }
    const Embed = new discord.MessageEmbed();
    Embed
        .setColor('#007acd')
        .setTitle('Poll time !')
        .setAuthor(bot.user.username)
        .addField(user + "'s question : ", question)
        .addField("Choices", resultString)
    return Embed;
}


function InfoEmbed(bot, fields) {
    let commandString = '';
    for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
            commandString += '`' + key + '`' + ' : ' + fields[key] + '\n';
        }
    }

    const Embed = new discord.MessageEmbed();
    Embed
        .setColor('#007acd')
        .setTitle('Info board')
        .setAuthor(bot.user.username)
        .setDescription("Displays all the bot's commands")
        .attachFiles(['./Bots_infos/BotPoll/BotPollPFP.jpg'])
        .setThumbnail('attachment://BotPollPFP.jpg')
        .addField("Commands", commandString)
        .setTimestamp()
        .setFooter('Made by ' + botInfo.admin)
    return Embed;
}
