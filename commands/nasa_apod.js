const Discord = require("discord.js")
const config = require(`../config.json`)
const superagent = require("superagent")
module.exports.run = async (client, message, args, embed_color, lang) => {
    let {
        body
    } = await superagent.get("https://api.nasa.gov/planetary/apod?api_key=m8HygKr7LpNHlHtTwdPxZxxEmCh3LnWAKrwm0gHs")
    let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle(lang.commands.nasa.embeds.titles[0])
        .setURL(body.hdurl)
        .setImage(body.hdurl)
    message.channel.send(embed)
}
module.exports.help = {
    name: "nasa",
    category: "util"
}
module.exports.aliases = ["nasa", "nasa_pics"]