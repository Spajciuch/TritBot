const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.warn.replies.permission_error)
    const member = message.mentions.members.first()
    const user = member.user
    if (!user) return message.reply(lang.commands.warn.replies.no_member)
    const newReason = args.join(" ").slice(22)
    if (!newReason) return message.reply(lang.commands.warn.replies.no_reason)

    const database = require("firebase").database()
    database.ref(`/warns/${message.guild.id}/${user.id}/`).once("value").then(async warns => {
        database.ref(`/settings/${message.guild.id}/forBan`).once("value").then(async ban => {
            database.ref(`/settings/${message.guild.id}/`).once("value").then(data => {
                const settings = data.val()
                let forBan = ban.val()
                if (!forBan) message.reply(lang.commands.warn.replies.forBan)
                let warn = warns.val()
                let reasons
                let count
                let byList
                if (!warn) {
                    reasons = []
                    count = 0
                    byList = []
                } else {
                    reasons = warn.reasons
                    count = warn.count
                    if (!warn.byList) byList = []
                    else byList = warn.byList
                }

                byList[byList.length || 0] = message.author.tag

                if (!reasons) reasons = []

                reasons[reasons.length || 0] = newReason
                count += 1

                const warnModule = require("../listeners/warns.js")
                warnModule.run(message.guild.id, user.id, message.channel.id, client)

                database.ref(`/warns/${message.guild.id}/${user.id}`).set({
                    "reasons": reasons,
                    "byList": byList
                })

            })
        })
    })
}
module.exports.help = {
    name: "warn",
    category: "admin"
}
module.exports.aliases = ["zgłoś"]