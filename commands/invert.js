const Discord = require("discord.js")
const chalk = require("chalk")
const snekfetch = require("snekfetch")

module.exports.run = async (client, message, args, embed_color, lang) => {

    let user

    if (message.mentions.members.first()) {
        user = message.mentions.members.first().user
    } else user = message.author

    let {
        createCanvas,
        loadImage
    } = require('canvas')

    var canvas = createCanvas(800, 800)

    var ctx = canvas.getContext('2d')

    const {
        body: buffer
    } = await snekfetch.get(user.displayAvatarURL());
    const avt = await loadImage(buffer);
    ctx.drawImage(avt, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const attachment = new Discord.Attachment(canvas.toBuffer(), "profile.png")
    message.channel.send(attachment)
}

module.exports.help = {
    name: "invert",
    category: "util"
}

module.exports.aliases = ["negatyw", "negative"]