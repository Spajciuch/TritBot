var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    message.author.send("https://discordapp.com/api/oauth2/authorize?client_id=564837787463843840&permissions=8&scope=bot")
    message.reply("Ok ✅").then(msg => {
        msg.delete({
            timeout: 1500
        }).then(() => message.delete())
    })
}
module.exports.help = {
    name: "invite",
    category: "info"
}
module.exports.aliases = ["zaproś", "zapros"]
