const Discord = require("discord.js")

module.exports.run = async (client, message, args, embed_color, lang) => {
    const {
        createCanvas,
        loadImage
    } = require('canvas')

    const snekfetch = require("snekfetch")

    const canvas = createCanvas(500, 250)
    const ctx = canvas.getContext('2d')

    const {
        body: buffer
    } = await snekfetch.get(message.member.user.displayAvatarURL().replace("webp", "png"))

    const avt = await loadImage(buffer);
    ctx.drawImage(avt, 30, 23, 90, 90);

    const bkg = await loadImage("./photos/welcome_card.png");
    ctx.drawImage(bkg, 0, 0, 500, 250)

    ctx.textAlign = "left";

    ctx.font = `35px "MuseoModerno"`
    ctx.fillStyle = "#625b5b";
    
    ctx.fillText("Witaj na serwerze", 158, 70)
    ctx.fillText(`${message.author.username}#${message.author.discriminator}`, 30, 150)

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png")
    message.channel.send(attachment)
}


module.exports.help = {
    name: "cardTest"
}