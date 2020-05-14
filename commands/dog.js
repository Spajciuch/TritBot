const Discord = require("discord.js")
const config = require(`../config.json`)
const superagent = require("superagent")
module.exports.run = async (client, message, args, embed_color, lang) => {
    let {
        body
    } = await superagent.get("https://api.thedogapi.com/v1/images/search")
    let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle(lang.commands.dog.embeds.titles[0])
        .setImage(body[0].url)
    message.channel.send(embed)

}
module.exports.help = {
    name: "dog",
    category: "util"
}

module.exports.aliases = ["doggo", "pies", "piesek"]