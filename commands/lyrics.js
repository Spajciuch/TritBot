const Discord = require("discord.js")

module.exports.run = async (client, message, args, embed_color, lang) => {
    const lyricsFinder = require('lyrics-finder');

    (async function (artist, title) {
        let lyrics = await lyricsFinder(artist, title) || lang.commands.lyrics.error

        let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle(lang.commands.lyrics.embeds.titles[0] + args.join(" "))
        .setDescription(lyrics)

        message.channel.send(embed)
    })("", args.join(" "))
}

module.exports.help = {
    name: "lyrics",
    category: "util"
}

module.exports.aliases = ["tekst"]