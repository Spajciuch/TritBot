const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    const database = require("firebase").database()
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.check.replies.permission_error)
    let member = message.mentions.members.first()
    if (!member) return message.reply(lang.commands.check.replies.no_member)

    database.ref(`/settings/${message.guild.id}/forBan`).once("value").then(ban => {
        let forBan = ban.val()
        database.ref(`/warns/${message.guild.id}/${member.user.id}/`).once("value").then(warn => {

            let byList
            let warns = warn.val()

            if (!warns || warns.count == 0) return message.reply(lang.commands.check.replies.no_warns)
            let reasons = warns.reasons

            if (!warns.byList) byList = Array(reasons.length).fill("old warn :/")
            else if (warns.byList.length < reasons.length) {
                byList = warns.byList
                for (var i = 0; i <= reasons.length - byList.length - 1; i++) {
                    byList.splice(i, 0, "Old warn :/")
                }
            } else byList = warns.byList


            let embed = new Discord.MessageEmbed()
                .setAuthor(lang.commands.check.embeds.titles[0] + member.user.tag, member.user.displayAvatarURL())
                .setColor(embed_color)
                .setTimestamp()

            if (forBan == null) embed.setFooter(lang.commands.check.embeds.footers[0])
            else embed.setFooter(`${lang.commands.check.embeds.footers[1]} ${forBan - warns.count}`)

            let description = ""
            for (i = 0; i <= warns.reasons.length - 1; i++) {
                description += `[${i+1}] ${reasons[i]} - ${byList[i]}\n`
            }

            embed.setDescription(description)
            message.channel.send(embed)
        })
    })
}
module.exports.help = {
    name: "check",
    category: "admin"
}
module.exports.aliases = ["sprawdź", "warny"]