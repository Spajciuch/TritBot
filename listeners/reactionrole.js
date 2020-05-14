const Discord = require("discord.js")
const {
    database
} = require("firebas")
module.exports.run = async (client, message, args, embed_color, lang) => {
    message.channel.send("Zareaguj pod tą wiadomością `❤` aby dostać rolę").then(m => {
        m.react("❤")
        const reactionFilter = (reaction, user) => reaction.emoji.name === '❤'
        const collector = m.createReactionCollector(reactionFilter)

        collector.on("collect", r => {
            const users = Array.from(r.users.keys())
            if (users.length == 1) return

            const member = message.guild.members.cache.get(users[users.length - 1])
            member.addRole("697811665386864690")
        })
    })
}

module.exports.help = {
    name: "reaction"
}
module.exports.aliases = ["react", "role", "reactionrole"]