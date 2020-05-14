const Discord = require("discord.js")
const chalk = require("chalk")
const {
    database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.anon.replies.permissionError)

    if (!args[0]) {
        const Discord = require("discord.js")
        const chalk = require("chalk")
        const {
            database
        } = require("firebase")

        module.exports.run = async (client, message, args, embed_color, lang) => {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.anon.replies.permissionError)

            if (!args[0]) {
                database().ref(`/anon/${message.guild.id}`).once("value").then(data => {
                    if (!data.val()) {
                        database().ref(`/anon/${message.guild.id}`).set({
                                channel: message.channel.id
                            })
                            .then(() => {
                                message.reply(lang.commands.anon.replies.successEnable)
                            })
                    } else {
                        database().ref(`/anon/${message.guild.id}`).remove()
                            .then(() => {
                                message.reply(lang.commands.anon.replies.successDisable)
                            })
                    }
                })
            }
        }
        database().ref(`/anon/${message.guild.id}`).once("value").then(data => {
            if (!data.val()) {
                database().ref(`/anon/${message.guild.id}`).set({
                        channel: message.channel.id
                    })
                    .then(() => {
                        message.reply(lang.commands.anon.replies.successEnable)
                    })
            } else {
                database().ref(`/anon/${message.guild.id}`).remove()
                    .then(() => {
                        message.reply(lang.commands.anon.replies.successDisable)
                    })
            }
        })
    }
}

module.exports.help = {
    name: "anon",
    category: "util"
}

module.exports.aliases = ["anonimowy"]