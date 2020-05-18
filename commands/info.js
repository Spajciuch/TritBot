var Discord = require("discord.js");
var config = require(`../config.json`)
const chalk = require("chalk")
module.exports.run = async (client, message, args, embed_color, lang) => {
    const channel = client.channels.cache.get("566197088132792348")
    const lastId = channel.lastMessageID
    channel.messages.fetch(lastId)
        .then(msg => {
            var moment = require('moment')
            var ms = require('ms')
            let embed = new Discord.MessageEmbed()
                .setColor(embed_color)
                .setAuthor(lang.commands.info.embeds.titles[0], client.user.displayAvatarURL())
                .setFooter(`${lang.commands.info.embeds.footers[0]} ${moment.utc(new Date).format("DD.MM.YYYY")}`)
                .addField(lang.commands.info.embeds.fields[0], lang.commands.info.embeds.inField.bot_info)
                .addField(lang.commands.info.embeds.fields[1], client.users.cache.size + " " + lang.commands.info.embeds.inField.members + "\n" + client.guilds.cache.size + " " + lang.commands.info.embeds.inField.guilds)
                .addField(lang.commands.info.embeds.fields[2], "08.04.2019", true)
                .addField(lang.commands.info.embeds.fields[3], moment.utc(message.guild.joinedAt).format("DD.MM.YYYY"), true)
                .addField(lang.commands.info.embeds.fields[4], ms(client.uptime), true)
                .addField(lang.commands.info.embeds.fields[5], msg.embeds[0].description)
            message.channel.send(embed)
        })
        .catch(err => {
            console.error(chalk.red("[error] ") + chalk.red(err))
        })
}
module.exports.help = {
    name: "info",
    category: "info"
}
module.exports.aliases = ["informacje"]