const Discord = require("discord.js")
const config = require(`../config.json`)
const chalk = require("chalk")
module.exports.run = async (client, message, args, embed_color, lang) => {
    const channel = client.channels.cache.get("566197088132792348")
    const lastId = channel.lastMessageID
    channel.messages.fetch(lastId)
        .then(msg => {
            let embed = new Discord.MessageEmbed()
                .setColor(embed_color)
                .setAuthor(lang.commands.last.embeds.titles[0], client.user.displayAvatarURL())
                .setDescription(msg.embeds[0].description)
            message.channel.send(embed)
        })
        .catch(err => {
            console.error(chalk.red("[error] ") + chalk.red(err))
        })
}
module.exports.help = {
    name: "last",
    category: "info"
}