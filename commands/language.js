const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
    const database = require("firebase").database()
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(lang.commands.language.replies.permission_error)
    if (!args[0]) {
        return message.reply(lang.commands.language.replies.proper_use)
    } else if (args[0] == "PL") {
        database.ref(`/settings/${message.guild.id}`).once("value").then(data => {
            const settings = data.val()

            database.ref(`/settings/${message.guild.id}`).set({
                "version": 5,
                "embed_color": settings.embed_color || null,
                "prefix": settings.prefix || null,
                "wmsg": settings.wmsg || null,
                "wlcm": settings.wlcm || null,
                "wchan": settings.wchan || null,
                "wrole": settings.wrole || null,
                'gbmsg': settings.gbmsg || null,
                "gbay": settings.gbay || null,
                "gbchan": settings.gbchan || null,
                "leveling": settings.leveling || null,
                "logs": settings.logs || null,
                "logschan": settings.logschan || null,
                "badWords": settings.badWords || null,
                "forBan": settings.forBan || null,
                "language": "PL"
            })
            .then(() => {
                message.reply("ustawiono język na polski")
            })
            .catch(err => {
                console.log(chalk.red(`[error] ${err}`))
            })
        })
    } else if (args[0] == "EN") {
        database.ref(`/settings/${message.guild.id}`).once("value").then(data => {
            const settings = data.val()

            database.ref(`/settings/${message.guild.id}`).set({
                "version": 5,
                "embed_color": settings.embed_color || null,
                "prefix": settings.prefix || null,
                "wmsg": settings.wmsg || null,
                "wlcm": settings.wlcm || null,
                "wchan": settings.wchan || null,
                "wrole": settings.wrole || null,
                'gbmsg': settings.gbmsg || null,
                "gbay": settings.gbay || null,
                "gbchan": settings.gbchan || null,
                "leveling": settings.leveling || null,
                "logs": settings.logs || null,
                "logschan": settings.logschan || null,
                "badWords": settings.badWords || null,
                "forBan": settings.forBan || null,
                "language": "EN"
            })
            .then(() => {
                message.reply("laguage has been set to: **EN**")
            })
            .catch(err => {
                console.log(chalk.red(`[error] ${err}`))
            })
        })
    } else {
        return message.reply(lang.commands.language.proper_use)
    }
}
module.exports.help = {
    name: "language",
    category: "admin"
}

module.exports.aliases = ["język"]