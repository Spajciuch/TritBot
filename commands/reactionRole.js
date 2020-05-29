const Discord = require("discord.js")
const {
    database
} = require("firebase")

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

module.exports.run = async (client, message, args, embed_color, lang) => {
    const replies = lang.commands[this.help.name].replies
    const embeds = lang.commands[this.help.name].embeds

    let roles = []
    let emojis = []

    message.channel.send(replies.rolesInstrucion).then(() => {

        const filter = msg => msg.author.id == message.author.id
        const collector = new Discord.MessageCollector(message.channel, filter)

        collector.on("collect", msg => {
            roles = msg.content.split(" ")

            for (var i = 0; i <= roles.length - 1; i++) {
                roles[i] = roles[i].replace("<@&", "").replace(">", "")
                if (isNaN(roles[i])) return message.reply(replies.noRole)
            }

            if (msg.content.toLowerCase() == "stop") collector.stop()

            collector.stop()
        })

        collector.on("end", async m => {
            const emojiFilter = msg => msg.author.id == message.author.id
            const emojiCollector = new Discord.MessageCollector(message.channel, emojiFilter)

            message.channel.send(replies.emojiInstruction)

            emojiCollector.on("collect", msg => {
                emojis = msg.content.split(" ")

                for (var i = 0; i <= emojis.length - 1; i++) {
                    emojis[i] = emojis[i].replace("<:", "").replace(">", "").split(":")
                }

                if (msg.content.toLowerCase() == "stop") emojiCollector.stop()

                emojiCollector.stop()
            })

            emojiCollector.on("end", m => {
                let embed = new Discord.MessageEmbed()
                    .setColor(embed_color)
                    .setTitle(embeds.titles)
                let description = ""

                for (var i = 0; i <= roles.length - 1; i++) {

                    if(!emojis[i]) return message.reply(replies.tooLow)

                    if (emojis[i][1]) {
                        description += `<@&${roles[i]}> - <:${emojis[i][0]}:${emojis[i][1]}>\n`
                    } else {
                        description += `<@&${roles[i]}> - ${emojis[i]}\n`
                    }
                }
                embed.addField(embeds.fields, description, true)

                message.channel.send(embed).then(roleMenu => {

                    let emojiList = []

                    for (var i = 0; i <= roles.length - 1; i++) {
                        if (emojis[i][1]) {
                            roleMenu.react(emojis[i][1])
                            emojiList[emojiList.length] = emojis[i][0]
                        } else {
                            roleMenu.react(emojis[i][0])
                            emojiList[emojiList.length] = emojis[i][0]
                        }
                    }

                    if (hasDuplicates(emojiList)) return message.reply(replies.duplicates)
                    if(roles.length > emojiList.length) return message.reply(replies.tooLow)
                    if(roles.length < emojiList.length) return message.reply(replies.tooMany)

                    database().ref(`/reactionRole/${message.guild.id}`).set({
                        emojis: emojiList,
                        roles: roles,
                        messageId: roleMenu.id
                    }).then(() => {
                        message.reply(replies.succes).then(x => x.delete({
                            timeout: 5000
                        }))
                    })

                })
            })
        })
    })
}

module.exports.help = {
    name: "reactionRole"
}
module.exports.aliases = ["react", "role", "reactionrole"]