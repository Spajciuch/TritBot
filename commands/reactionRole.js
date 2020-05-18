const Discord = require("discord.js")
const {
    database
} = require("firebase")

const roles = ["584376630928080897", "584376636850438148", "586948351334023188"]
const emojis = ["❤", "🌺", "🎈"]

function createCollector(message, emoji) {
    const reactionFilter = (reaction, user) => reaction.emoji.name == emoji
    const collector = message.createReactionCollector(reactionFilter)

    return collector
}
module.exports.run = async (client, message, args, embed_color, lang) => {
    let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle("Menu ról")
    let description = ""
    for (var i = 0; i <= roles.length - 1; i++) {
        description += `<@&${roles[i]}> - ${emojis[i]}\n`
    }
    embed.addField("Wybierz role z listy", description, true)

    message.channel.send(embed).then(async m => {
        for (var i = 0; i <= roles.length - 1; i++) {
            await m.react(emojis[i])

            eval(`
            const collector = createCollector(m, emojis[i])
            const role = roles[i]
            collector.on("collect", r => {
                console.log("dano reakdzje")
                const users = Array.from(r.users.cache.keys())

                const member = message.guild.members.cache.get(users[users.length - 1])
                member.roles.add(role)
            })
            collector.on("dispose", r => {
                console.log("pozbyto sie roli")
                const users = Array.from(r.users.cache.keys())

                const member = message.guild.members.cache.get(users[users.length - 1])
                member.roles.remove(role)
            })
            `)
        }
    })
}

module.exports.help = {
    name: "reaction"
}
module.exports.aliases = ["react", "role", "reactionrole"]