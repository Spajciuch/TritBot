const Discord = require("discord.js")
const config = require("../config.json")
const giphy = require('giphy-api')(config.giphy);
module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!args[0]) return message.reply("forever alone? :c")

    let person = message.mentions.members.first()
    if (!person) person = args.join(" ")
    else {
        if (message.mentions.members.first().user.id == message.author.id) return message.reply("forver alone? :c")
        person = person.user.username
    }
    giphy.search("pat a pet", function (err, res) {
        let embed = new Discord.MessageEmbed()
            .setColor(embed_color)
            .setAuthor(`${message.author.username} ${lang.commands.pat.embeds.titles[0]} ${person}`, message.author.displayAvatarURL())
            .setImage(`https://media.giphy.com/media/${res.data[Math.floor(Math.random() * res.data.length)].id}/giphy.gif`)
        message.channel.send(embed)

    });
}
module.exports.help = {
    name: "pat",
    category: "util"
}
module.exports.aliases = ["głaszcz"]