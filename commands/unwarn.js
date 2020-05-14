const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(lang.commands.unwarn.replies.permission_error)
    if (!message.mentions.members.first()) return message.reply(lang.commands.unwarn.replies.no_member)
    if (!args[0]) return message.reply(lang.commands.unwarn.replies.no_args)

    const member = message.mentions.members.first()

    const database = require("firebase").database()
    database.ref(`/warns/${message.guild.id}/${member.user.id}`).once("value").then(data => {
        const warns = data.val()
        const count = warns.count
        const reasons = warns.reasons
        const byList = warns.byList

        if (isNaN(args.join(" ").slice(22))) {
            const position = reasons.indexOf(args.join(" ").slice(22))

            if (position < 0) return message.reply(lang.commands.unwarn.replies.notfound)

            reasons.splice(position, 1)
            byList.splice(position, 1)
        } else {
            const position = Number(args.join(" ").slice(22)) - 1

            if (position < 0 || position > reasons.length) return message.reply(lang.commands.unwarn.replies.number_error)

            reasons.splice(position, 1)
            byList.splice(position, 1)
        }

        database.ref(`/warns/${message.guild.id}/${member.user.id}`).set({
                count: reasons.length,
                reasons: reasons,
                byList: byList
            })
            .then(() => {
                message.reply(lang.commands.unwarn.replies.success)
            })
            .catch(err => {
                console.log(chalk.red(`[error] ${err}`))
                message.reply(lang.commands.unwarn.replies.error)
            })
    })

}

module.exports.help = {
    name: "unwarn",
    category: "admin"
}