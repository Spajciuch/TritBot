const Discord = require("discord.js")
const {
    database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
    let status
    let toSave
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(lang.commands.voiceDetect.replies.permission_error)

    database().ref(`/voiceDetect/${message.guild.id}/enabled`).once("value").then(data => {
        status = data.val()

        if (status == true) {
            toSave = false
        } else toSave = true

        database().ref(`/voiceDetect/${message.guild.id}`).set({
            enabled: toSave
        }).then(() => {
            if (toSave == false) message.reply(lang.commands.voiceDetect.replies.disabled)
            else message.reply(lang.commands.voiceDetect.replies.enabled)
        })

    })
}

module.exports.help = {
    name: "voiceDetect",
    category: "admin"
}