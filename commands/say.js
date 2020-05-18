const Discord = require("discord.js")

module.exports.run = async (client, message, args, embed_color, lang) => {
    message.delete()
    message.channel.send(args.join(" "))
}

module.exports.help = {
    name: "say",
    category: "util"
}