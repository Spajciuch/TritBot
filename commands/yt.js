const Discord = require("discord.js")

module.exports.run = async (client, message, args, embed_color, lang) => {
    const yt = require('youtube-downloader');
    const fs = require('fs');

    yt.convertVideo('https://www.youtube.com/watch?v=w_mY4Ydw54U').then((res) => {
        res.pipe(fs.createWriteStream('./song.mp3'))
    })
}
module.exports.help = {
    name: "yt",
    category: "util"
}