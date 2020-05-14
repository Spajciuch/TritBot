const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {

    const createReactionCollector = async (m, emojis, i) => {
        const emojiFilter = r => r.emoji.name == emojis[i]
        const emojiCollector = new Discord.ReactionCollector(m, emojiFilter)

        emojiCollector.on("collect", r => {
            console.log(r)
        })
    }

    const isEmoji = function (str) {
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ];
        if (str.match(ranges.join('|'))) {
            return true;
        } else {
            return false;
        }
    }

    const {
        database
    } = require("firebase")

    if (!args[0]) return message.reply("poprawne użycie: `nie wiem jeszcze jakie xD`")

    if (args[0] == "create") {
        const rolesNames = args.join(" ").split(" | ")
        if (!rolesNames) return message.reply("podaj nazwy ról oddzielone ` | ` ")

        rolesNames[0] = rolesNames[0].replace("create ", "")

        const roles = message.guild.roles
        let rolesIds = []

        for (var i = 0; i <= rolesNames.length - 1; i++) {
            const role = roles.cache.find(roles => roles.name == rolesNames[i])
            if (!role) return;

            rolesIds[i] = role.id
        }

        database().ref(`/roleMenu/${message.guild.id}`).set({
                rolesIds: rolesIds
            })
            .then(() => {
                message.reply("podaj teraz emoji w odpowiedniej kolejności, oddzielając je | ")

                let emojis = []

                const filter = msg => msg.author.id == message.author.id;
                const collector = new Discord.MessageCollector(message.channel, filter);

                collector.on("collect", msg => {
                    const arguments = msg.content.trim().split(/ +/g)
                    emojis = arguments.join(" ").split(" | ")
                    if (msg.content.includes(">")) return message.reply("nie podawaj customowych emoji")
                    if (!isEmoji(msg.content)) return message.reply("podawaj emoji!")
                    collector.stop()
                })
                collector.on("end", msg => {
                    let messageContent = ""

                    for (var i = 0; i <= rolesIds.length - 1; i++) {
                        messageContent += message.guild.roles.get(rolesIds[i]) + " `->` " + emojis[i] + "\n"
                    }

                    message.channel.send(messageContent)
                        .then(m => {
                            for (var i = 0; i <= emojis.length - 1; i++) {
                                m.react(emojis[i])
                            }
                            database().ref(`/roleMenu/${message.guild.id}`).set({
                                    rolesIds: rolesIds,
                                    emojis: emojis
                                })
                                .then(() => {
                                    message.reply("✅ Ustawiono menu z rolami")
                                        .then(mess => mess.delete(1500))
                                })
                            for (var i = 0; i <= emojis.length - 1; i++) {
                                createReactionCollector(m, emojis, i)
                            }
                        })
                })
            })
    }
}

module.exports.help = {
    name: "react",
    category: "swswsw"
}