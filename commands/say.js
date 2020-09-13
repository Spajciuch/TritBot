const Discord = require("discord.js")

module.exports.run = async (client, message, args, embed_color, lang) => {
    message.delete()
    message.channel.send(args.join(" ").replace("@everyone", "everyone").replace("@here", "here"))
    if(message.content.includes("@everyone") || message.content.includes("@here") && message.autohr.id == "484006841781583883") message.reply("Skoncz z tym plz")
}

module.exports.help = {
    name: "say",
    category: "util"
}
