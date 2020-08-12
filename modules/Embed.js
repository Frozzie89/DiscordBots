const discord = require('discord.js');

// generates an Embed poll
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

// generates an Embed info board
function InfoEmbed(bot, botInfo, fields) {
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

exports.InfoEmbed = InfoEmbed;
exports.PollEmbed = PollEmbed;