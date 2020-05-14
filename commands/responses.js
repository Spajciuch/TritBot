module.exports.run = async (client, message, args, embed_color, lang) => {
    if (lang.title == "EN") return message.reply("only avaible in polish version -> to change `$language PL`")
    const {
        database
    } = require("firebase")

    database().ref(`/repsonses/${message.guild.id}/status`).once("value").then(d => {
        const state = d.val()
        let newState

        if (!state || state == false) {
            newState = true
            message.reply(lang.commands[this.help.name].replies.succes_on)
        } else {
            newState = false
            message.reply(lang.commands[this.help.name].replies.succes_off)
        }

        database().ref(`/repsonses/${message.guild.id}/`).set({
            status: newState
        })
    })
}

module.exports.help = {
    name: "responses",
    category: "admin"
}

module.exports.aliases = ["odpowiedzi"]