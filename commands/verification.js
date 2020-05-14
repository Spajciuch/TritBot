const Discord = require("discord.js")
const chalk = require("chalk")
const database = require("firebase").database()

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(lang.commands.verification.replies.permission_error)
    if (!args[0]) return message.reply(lang.commands.verification.replies.no_roles)

    if (args[0] == "reaction") {
        message.delete()
        message.reply(lang.commands.verification.replies.success).then(msg => msg.delete({
            timeout: 5000
        }))
        let embed = new Discord.MessageEmbed()
            .setColor(embed_color)
            .setTitle(lang.commands.verification.embeds.titles[0])
            .setDescription(lang.commands.verification.embeds.descriptions[1])
        message.channel.send(embed).then(m => {

            m.react("❤")

            // USTAWIANIE DANYCH W FIREBASE

            database.ref(`/verification/${message.guild.id}`).set({
                channel: message.channel.id,
                message: m.id,
                role: args[1].replace("<@&", "").replace(">", "")
            })

            // DODANIE SERWERKA DO LISTY Z WŁĄCZONĄ WERYFIKACJĄ, ABY BOT NIE SPRAWDZAŁ WSZSTKICH 150 SERWERÓW NA RAZ

            database.ref(`/reaction_role/list`).once("value").then(list => {
                let guilds = list.val()

                if (!list.val()) guilds = Array()

                if (guilds.includes(message.guild.id)) return

                guilds[guilds.length] = message.guild.id
                database.ref(`/reaction_role`).set({
                    list: guilds
                })
            })

            //TWORZENIE COLLECTORA - PIERWSZE URUCHOMIENIE NIE JEST WYKONYWANE POPRZEZ AUTOMATYCZNY PROCES

            const reactionFilter = (reaction, user) => reaction.emoji.name === '❤'
            const collector = m.createReactionCollector(reactionFilter)

            collector.on("collect", r => {
                const users = Array.from(r.users.keys())
                if (users.length == 1) return

                const member = message.guild.members.cache.get(users[users.length - 1])
                member.roles.add(args[1].replace("<@&", "").replace(">", ""))
            })
        })
    }

    if (args[0] == "create") {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(lang.commands.verification.replies.permission_error)
        let rolesList = []
        for (var i = 1; i <= args.length - 1; i++) {
            let rawRole = args[i]
            rolesList[i - 1] = rawRole.replace("<@&", "").replace(">", "")
        }
        if (args.length == 1) return message.reply(lang.commands.verification.replies.no_roles)
        database.ref(`verification/${message.guild.id}`).set({
                channel: message.channel.id,
                rolesList: rolesList
            })
            .then(() => {
                message.reply(lang.commands.verification.replies.success).then(m => m.delete({
                    timeout: 5000
                }))
                let embed = new Discord.MessageEmbed()
                    .setColor(embed_color)
                    .setTitle(lang.commands.verification.embeds.titles[0])
                    .setDescription(lang.commands.verification.embeds.descriptions[0] || "-błąd men-")
                let roles = ""
                for (var i = 1; i <= args.length - 1; i++) {
                    roles += `\n${args[i]}`
                }
                // embed.addField(lang.commands.verification.embeds.fields[0], roles)
                message.channel.send(embed)
                message.delete()
                    .catch(err => {
                        console.log(chalk.red(`[error] ${err}`))
                    })
            })
            .catch(err => {
                message.reply(lang.commands.verification.replies.error + err)
                console.log(chalk.red(`[error] ${err}`))
            })
    } else if (args[0] == "disable") {
        database.ref(`reaction_role/list`).once("value").then(l => {
            let list = l.val()

            if (list.indexOf(message.guild.id) < 0) return;

            list.splice(list.indexOf(message.guild.id), 1)

            database.ref(`/reaction_role`).set({
                list: list
            })
        })
        database.ref(`verification/${message.guild.id}`).remove()
            .then(() => {
                message.reply(lang.commands.verification.replies.disable)
            })
            .catch(err => {
                console.log(chalk.red(`[error] ${err}`))
                message.reply(lang.commands.verification.replies.error)
            })
    }
}

module.exports.start = async (client) => {

    database.ref(`/reaction_role/list`).once("value").then(l => {
        const list = l.val()

        if (!l.val()) return

        list.forEach(guildID => {
            database.ref(`/verification/${guildID}`).once("value").then(data => {
                const config = data.val()

                const channel = client.channels.cache.get(config.channel)
                if (!channel) return;

                channel.messages.fetch(config.message).then(message => {

                    const reactionFilter = (reaction, user) => reaction.emoji.name === '❤'
                    const collector = message.createReactionCollector(reactionFilter)
                    collector.on("collect", r => {
                        const users = Array.from(r.users.keys())

                        const member = message.guild.members.cache.get(users[users.length - 1])
                        member.roles.add(config.role)
                    })
                }).catch(err => console.log(chalk.red(`[error] ${err}`)))
            })
        })
    })

    client.on("guildMemberAdd", member => {
        database.ref(`verification/${member.guild.id}`).once("value").then(data => {
            database.ref(`settings/${member.guild.id}/prefix`).once("value").then(pf => {
                const prefix = pf.val()

                if (!data.val()) return
                const verification = data.val()

                const filter = msg => msg.channel.id == verification.channel && msg.author.id == member.user.id
                const channel = member.guild.channels.cache.get(verification.channel)
                const collector = new Discord.MessageCollector(channel, filter);
                const rolesToGive = []
                collector.on("collect", msg => {
                    msg.delete()
                        .catch(err => {
                            console.log(chalk.red(`[error] ${err}`))
                        })
                    if (msg.content.toLowerCase() == "weryfikacja" || msg.content.toLowerCase() == "verify") {
                        const defaultRole = member.guild.roles.cache.get(verification.rolesList[0])
                        msg.member.roles.add(defaultRole)
                        if (member.guild.id == "678305767756922912") {
                            const role = member.guild.roles.cache.get("693802548766703647")
                            msg.member.roles.remove(role)
                        }
                        collector.stop()
                    }
                })
            })
        })
    })
}

module.exports.help = {
    name: "verification",
    category: "admin"
}
module.exports.aliases = ["weryfikacja", "weryfikuj", "verify"]