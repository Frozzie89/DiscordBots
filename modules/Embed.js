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
        .setFooter("Results will be shown in 5 minutes")
    return Embed;
}

function resultPollEmbed(bot, user, question, args, votes) {
    let resultString = '';
    let pourcent = '';
    let voteString = '';
    let winner = {
        args: "",
        votes: 0
    };

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    for (let i = 0; i < args.length; i++) {
        pourcent += (votes.reduce(reducer) > 0 ? (votes[i] / votes.reduce(reducer)) * 100 : 0) + ' %\n';
        voteString += votes[i] + '\n';
        resultString += ":regional_indicator_" + String.fromCharCode(96 + i + 1) + ": : " + args[i] + "\n";
        if (votes[i] > winner.votes) {
            winner.votes = votes[i];
            winner.args = args[i];
        }
    }

    const Embed = new discord.MessageEmbed();
    Embed
        .setColor('#007acd')
        .setTitle('Times up, here are the results')
        .setAuthor(bot.user.username)
        .addField(user + "'s question : ", question)
        .addField('Results', resultString, true)
        .addField('\u200B', voteString, true)
        .addField('\u200B', pourcent, true)
        .addField('\u200B', winner.votes > 0 ? 'The answer to ' + user + "'s question is : **" + winner.args + "**" : 'No one voted :(')
        .setFooter('type !poll to start a poll')
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
exports.resultPollEmbed = resultPollEmbed;