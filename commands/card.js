const Discord = require("discord.js")
const { database } = require("firebase")

module.exports.run = async(client, message, args, embed_color, lang) => {
    const replies = lang.commands.card.replies
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(replies.premission_error)

    if(!args[0]) return message.reply(replies.properUse)

    if(args[0].toLowerCase() == "enable") {
        database().ref(`/settings/${message.guild.id}/wchan`).once("value").then(d => {
            if(!d.val()) return message.reply(replies.setChannel)
        })
        database().ref(`/card/${message.guild.id}/`).set({
            enabled: true
        }).then(() => message.reply(replies.success))
    } else if(args[0].toLowerCase() == "disable") {
        database().ref(`/card/${message.guild.id}/`).remove().then(() => message.reply(replies.disable))
    } else {
        message.reply(replies.properUse)
    }
}

module.exports.help = {
    name: "card",
    category: "admin"
}