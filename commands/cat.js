const Discord = require("discord.js")
const config = require(`../config.json`)
const superagent = require("superagent")
module.exports.run = async (client, message, args, embed_color, lang) => {
    let {
        body
    } = await superagent.get("https://api.thecatapi.com/v1/images/search")

    let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle(lang.commands.cat.embeds.titles[0])
        .setImage(body[0].url)
    message.channel.send(embed)

}
module.exports.help = {
    name: "cat",
    category: "util"
}
module.exports.aliases = ["cat", "kotek", "kitty"]