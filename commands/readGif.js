const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
    var gifFrames = require('gif-frames');
    var fs = require('fs');

    gifFrames({
        url: 'gifs/367390191721381890.gif',
        frames: "all"
    }).then(function (frameData) {
        for (var i = 0; i <= frameData.length - 1; i++) {
            frameData[i].getImage().pipe(fs.createWriteStream(`gifs/frames/${i}.jpg`));
        }
    });
}

module.exports.help = {
    name: "read"
}