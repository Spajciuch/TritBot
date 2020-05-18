var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color) => {
    var snekfetch = require("snekfetch")
    var {
        createCanvas,
        loadImage
    } = require('canvas')
    var canvas = createCanvas(1080, 720)
    var ctx = canvas.getContext('2d')
    var {
        body: buffer
    } = await snekfetch.get(message.author.displayAvatarURL());
    var avt = await loadImage(buffer);
    var card = await loadImage("./photos/profile_card.png");
    ctx.drawImage(card, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avt, 71, 57, 179, 179)
    ctx.font = `70px "Roboto Slab"`
    ctx.fillStyle = "#34393d";
    // ctx.textAlign="center";
    ctx.fillText(message.author.username, 660, 125)
    ctx.fillText("XP 150/300", 660, 225)
    ctx.fillText("87 LVL", 660, 325)
    var attachment = new Discord.Attachment(canvas.toBuffer(), 'card.png');
    message.channel.send(attachment)
}
module.exports.help = {
    name: "l",
    category: "",
    description: "",
    use: ""
}