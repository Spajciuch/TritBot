const Discord = require("discord.js")
const chalk = require("chalk")
const snekfetch = require("snekfetch")
const fs = require("fs")

module.exports.run = async (client, message, args, embed_color, lang) => {

    let user

    if (message.mentions.members.first()) {
        user = message.mentions.members.first().user
    } else user = message.author

    let {
        createCanvas,
        loadImage
    } = require('canvas')

    const GIFEncoder = require('gifencoder')
    const encoder = new GIFEncoder(800, 800);
    const pngFileStream = require('png-file-stream');

    var canvas = createCanvas(800, 800)

    var ctx = canvas.getContext('2d')

    const {
        body: buffer
    } = await snekfetch.get(user.displayAvatarURL().replace("webp", "png"));
    const avt = await loadImage(buffer);
    ctx.drawImage(avt, 0, 0, canvas.width, canvas.height);

    const writer = fs.createWriteStream(`gifs/inverted/${user.id}.gif`)

    encoder.createReadStream().pipe(writer)
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(10);
    encoder.setQuality(10);

    encoder.addFrame(ctx)
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    encoder.addFrame(ctx)
    encoder.finish();

    writer.on('finish', () => {
        message.channel.send({
            "files": [`gifs/inverted/${user.id}.gif`]
        })
    });
}

module.exports.help = {
    name: "epilepsy",
    category: "util"
}

module.exports.aliases = ["epilepsja"]