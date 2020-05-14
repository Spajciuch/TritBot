const Discord = require("discord.js")
const chalk = require("chalk")
const {
    database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(lang.commands.blacklist.replies.permission_error)

    if (!args[0]) return message.reply(lang.commands.blacklist.replies.proper_use)

    if (args[0] == "list") {
        database().ref(`/blacklist/${message.guild.id}/list`).once("value").then(data => {
            if (!data.val()) return message.reply(lang.commands.blacklist.replies.empty)

            const blacklist = data.val()

            let description = ""

            for (var i = 0; i <= blacklist.length - 1; i++) {
                description += `**[${i + 1}]** - ${blacklist[i]}\n`
            }

            let embed = new Discord.MessageEmbed()
                .setColor(embed_color)
                .setAuthor(lang.commands.blacklist.embeds.titles[0], message.guild.iconURL())
                .setDescription(description)
                .setTimestamp()
            message.channel.send(embed)
        })


    } else if (args[0] == "add") {
        if (!args[1]) return message.reply(lang.commands.blacklist.replies.no_id)
        if (isNaN(args[1])) return message.reply(lang.commands.blacklist.replies.no_id)

        const memberId = args[1]
        if (memberId.length < 18 || memberId.length > 18) return console.log(lang.commands.blacklist.replies.no_id)

        database().ref(`/blacklist/${message.guild.id}/list`).once("value").then(data => {
            let blacklist = []
            if (data.val()) blacklist = data.val()

            blacklist[blacklist.length] = memberId

            database().ref(`/blacklist/${message.guild.id}`).set({
                    list: blacklist
                })
                .then(() => {
                    message.reply(lang.commands.blacklist.replies.success)
                })
                .catch(err => {
                    console.log(chalk.red(`[error] ${err}`))
                    message.reply(lang.commands.blacklist.replies.error)
                })
        })
    } else if (args[0] == "remove") {
        database().ref(`/blacklist/${message.guild.id}/list`).once("value").then(data => {
            if (!data.val()) return message.reply(lang.commands.blacklist.replies.empty)

            let blacklist = data.val()

            const position = blacklist.indexOf(args[1])

            if (position < 0) return console.log(lang.commands.blacklist.replies.cannot_find)

            blacklist.splice(position, 1)

            database().ref(`/blacklist/${message.guild.id}`).set({
                    list: blacklist
                })
                .then(() => {
                    message.reply(lang.commands.blacklist.replies.success_remove)
                })
                .catch(err => {
                    console.log(chalk.red(`[error] ${err}`))
                })
        })
    }
}

module.exports.help = {
    name: "blacklist",
    category: "admin"
}