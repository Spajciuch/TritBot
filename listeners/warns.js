const Discord = require("discord.js")

module.exports.run = async (guildId, memberId, channelId, client) => {
    const user = client.users.cache.get(memberId)
    const guild = client.guilds.cache.get(guildId)
    const channel = client.channels.cache.get(channelId)
    const member = guild.members.cache.get(memberId)

    const {
        database
    } = require("firebase")

    database().ref(`/warns/${guildId}/${memberId}`).once("value").then(d => {
        database().ref(`settings/${guildId}`).once("value").then(settingsData => {
            const settings = settingsData.val()

            if (!settings) return

            let l = settings.language
            let lang
            if (l == "PL") lang = require("../languages/pl.json")
            else lang = require("../languages/en.json")

            const forBan = settings.forBan || null

            if (!d.val()) return
            const data = d.val()

            let warns = data.reasons
            let byList = data.byList

            let embed = new Discord.MessageEmbed()
                .setColor("#ff6f00")
                .setTitle("Warn")
                .addField(lang.logs.warn.embeds.fields[0], user.tag, true)
                .addField(lang.logs.warn.embeds.fields[1], byList[byList.length - 1], true)
                .addField(lang.logs.warn.embeds.fields[2], warns[warns.length - 1])
            if (settings.logs == true) {
                const channelId = settings.logschan
                const channel = guild.channels.cache.get(channelId.replace("<@", "").replace(">", ""))

                channel.send(embed)
            }

            if (warns.length >= forBan && forBan !== null) {
                member.ban("Warns -> Trit")
                    .then(() => {
                        channel.send(lang.commands.warn.replies.banned + user.tag)
                        database.ref(`/warns/${message.guild.id}/${user.id}`).remove()
                    })
                    .catch(() => {
                        channel.send(lang.commands.warn.replies.cannot_ban + user)
                    })
            }
        })
    })
}