const Discord = require("discord.js")
const config = require(`../config.json`)
const database = require("firebase").database()
module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!args[0]) return message.reply(lang.commands.note.replies.proper_use)
    if (args[0] == "create") {
        database.ref(`/notes/${message.author.id}/list`).once("value").then(data => {
            let list = data.val()
            let dates
            let notes
            if (!data.val()) {
                notes = []
                dates = []
            } else {
                dates = list.dates
                notes = list.notes
            }
            const today = new Date()
            let text = args.join(" ")
            notes[notes.length] = text.replace("create ", "")
            dates[dates.length] = `${today.getDate()}.${today.getMonth()}.${today.getFullYear()} - ${today.getHours() +2}:${today.getMinutes()}`
            database.ref(`/notes/${message.author.id}/list`).set({
                    notes: notes,
                    dates: dates
                })
                .then(() => {
                    message.reply(lang.commands.note.replies.saved)
                })
                .catch(err => {
                    message.reply(lang.commands.note.replies.error)
                })
        })
    } else if (args[0] == "read") {
        if (!args[1]) {
            database.ref(`/notes/${message.author.id}/list`).once("value").then(data => {
                const list = data.val()
                const notes = list.notes
                const dates = list.dates
                if (!data.val()) return message.reply(lang.commands.note.replies.no_notes)
                let embed = new Discord.MessageEmbed()
                    .setColor(embed_color)
                    .setAuthor(lang.commands.note.embeds.titles[0], message.author.displayAvatarURL())
                for (var i = 0; i <= notes.length - 1; i++) {
                    embed.addField(dates[i], lang.commands.note.embeds.fields[0] + Number(i + 1) + "**")
                }
                message.channel.send(embed)
            })
        } else {
            database.ref(`/notes/${message.author.id}/list`).once("value").then(data => {
                if (!data.val()) return message.reply(lang.commands.note.replies.no_notes)
                const list = data.val()
                const notes = list.notes
                const dates = list.dates
                if (args[1] > notes.length) return message.reply(lang.commands.note.replies.notfound)
                let embed = new Discord.MessageEmbed()
                    .setColor(embed_color)
                    .setAuthor(lang.commands.note.embeds.titles[1] + dates[args[1] - 1], message.author.displayAvatarURL())
                    .setDescription(notes[args[1] - 1])
                message.channel.send(embed)
            })
        }
    }
}
module.exports.help = {
    name: "note",
    category: "util"
}
module.exports.aliases = ["notatka"]