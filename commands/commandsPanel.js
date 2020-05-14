const Discord = require("discord.js")
const chalk = require("chalk")
const {
    database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
    const replies = lang.commands.command.replies
    const embed = lang.commands.command.embeds

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(replies.permission_error)
    if (args[0] == "enable") {
        if (!args[1]) return message.reply(replies.no_commandName)

        let command = client.commands.get(args[1]) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1]));

        if (!command) return message.reply("<:disable:665227998324326441> " + replies.no_command)

        database().ref(`commands/${message.guild.id}/switches/`).once("value").then(data => {
            let switches = data.val()
            switches[args[1]] = true

            database().ref(`commands/${message.guild.id}`).set({
                switches
            }).then(() => {
                message.reply(`<:enable:665228003558686730> ${replies.enable}`)
            })
        })
    } else if (args[0] == "disable") {
        if (!args[1]) return message.reply(replies.no_commandName)

        let command = client.commands.get(args[1]) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1]));

        if (!command) return message.reply("<:disable:665227998324326441> " + replies.no_command)

        database().ref(`commands/${message.guild.id}/switches/`).once("value").then(data => {
            let switches = data.val()
            switches[args[1]] = false

            database().ref(`commands/${message.guild.id}`).set({
                switches
            }).then(() => {
                message.reply(`<:disable:665227998324326441> ${replies.disable}`)
            })
        })
    }
}

module.exports.help = {
    name: "command",
    category: "admin"
}