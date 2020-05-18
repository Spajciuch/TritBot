var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    if (message.mentions.members.first()) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(lang.commands.avatar.embeds.titles[0] + message.mentions.members.first().user.tag, message.mentions.members.first().user.displayAvatarURL)
            .setImage(message.mentions.members.first().user.displayAvatarURL() + "?size=1024")
            .setColor(embed_color)
        message.channel.send(embed)
    } else {
        let embed = new Discord.MessageEmbed()
            .setAuthor(lang.commands.avatar.embeds.titles[1], message.author.displayAvatarURL())
            .setImage(message.author.displayAvatarURL() + "?size=1024")
            .setColor(embed_color)
        message.channel.send(embed)
    }
}
module.exports.help = {
    name: "avatar",
    category: "info"
}
module.exports.aliases = ["avatar", "awatar", "icon", "ikonka"]