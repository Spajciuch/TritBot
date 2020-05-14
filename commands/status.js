const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    const firebase = require("firebase")
    const database = firebase.database()
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("nie masz permisji :/")
    if (!message.guild.members.cache.get(client.user.id).hasPermission("MANAGE_CHANNELS")) return message.reply("nie mam permisji :/")
    if (args[0] == "start" || !args[0]) {
        message.guild.channels.create("📆", {
            type: "voice"
        }).then(date => {
            message.guild.channels.create("🧙‍", {
                type: "voice"
            }).then(all => {
                message.guild.channels.create("💚", {
                    type: "voice"
                }).then(online => {
                    message.guild.channels.create("🦈", {
                        type: "voice"
                    }).then(highscore => {
                        message.guild.channels.create(`${lang.commands.status.channels[4]}`, {
                            type: "voice"
                        }).then(lasttitle => {
                            message.guild.channels.create(lang.commands.status.channels[5], {
                                type: "voice"
                            }).then(last => {
                                database.ref(`/status/${message.guild.id}`).set({
                                    "date": date.id,
                                    "online": online.id,
                                    "all": all.id,
                                    "last": last.id,
                                    "highscore": highscore.id,
                                    "enabled": true
                                })
                            })
                        })
                    })
                })
            })
        })
    } else if (args[0] == "stop") {
        database.ref(`/status/${message.guild.id}/`).once("value").then(data => {
            const channels = data.val()
            console.log(channels)
            const date = message.guild.channels.cache.get(channels.date)
            const online = message.guild.channels.cache.get(channels.online)
            const all = message.guild.channels.cache.get(channels.all)
            const last = message.guild.channels.cache.get(channels.last)
            const highscore = message.guild.channels.cache.get(channels.highscore)

            date.delete()
            online.delete()
            all.delete()
            last.delete()
            highscore.delete()

            database.ref(`/status_look/${message.guild.id}`).once("value").then(d => {
                if (!d.val()) {
                    const channel = message.guild.channels.cache.find(channel => channel.name == lang.commands[this.help.name].channels[4])
                    if (channel) channel.delete()
                } else if (d.val()) {
                    const names = d.val()
                    const channel = message.guild.channels.cache.find(channel => channel.name == names[4])
                    if (channel) channel.delete()
                }
            }).then(() => {
                database.ref(`/status/${message.guild.id}/`).remove()
                database.ref(`/status_look/${message.guild.id}`).remove()
            })
        })

    } else if (args[0] == "customize") {
        let channelFunctions = lang.commands[this.help.name].channels
        const {
            database
        } = require("firebase")
        if (!args[1]) {
            database().ref(`/status_look/${message.guild.id}/list`).once("value").then(data => {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(lang.commands[this.help.name].embeds.titles[0], message.guild.iconURL())
                    .setColor(embed_color)
                    .setThumbnail("https://cdn.discordapp.com/attachments/566191017733390358/705470664768880701/info_emoji.png")
                    .setDescription(lang.commands[this.help.name].embeds.descriptions[0])

                if (data.val()) {
                    const channels = data.val()
                    for (var i = 0; i <= channels.length - 1; i++) {
                        embed.addField(`[${i+1}] ${channelFunctions[i]}`, channels[i])
                    }
                }

                if (!data.val()) {
                    const channels = lang.commands[this.help.name].channels
                    for (var i = 0; i <= channels.length - 1; i++) {
                        embed.addField(`[${i+1}] ${channelFunctions[i]}`, channels[i])
                    }
                }

                embed.addField(lang.commands[this.help.name].embeds.fields[0], lang.commands[this.help.name].embeds.fields[1])

                message.channel.send(embed)
            })
        } else {
            let channelNames = ""
            if (isNaN(args[1])) return message.reply(lang.commands[this.help.name].replies.isNaN)
            if (args[1] < 1) return message.reply(lang.commands[this.help.name].replies.range)
            if (args[1] > 5) return message.reply(lang.commands[this.help.name].replies.range)
            if (!args[2]) return message.reply(lang.commands[this.help.name].replies.no_name)

            let newName = args.join(" ").slice(args[0].length + args[1].length + 2)

            database().ref(`/status_look/${message.guild.id}/list`).once("value").then(data => {
                if (!data.val()) channelNames = channelFunctions
                else channelNames = data.val()

                if (args[1] == 5) {
                    const channelToFind = channelNames[4]
                    const channel = message.guild.channels.cache.find(channel => channel.name == channelToFind)
                    if (channel) channel.setName(newName)
                }

                channelNames[args[1] - 1] = newName

                database().ref(`/status_look/${message.guild.id}`).set({
                    list: channelNames
                }).then(() => {
                    message.reply(lang.commands[this.help.name].replies.success)
                })
            })
        }
    }
}
module.exports.start = async (client) => {
    const database = require("firebase").database()
    client.on("guildMemberAdd", member => {
        database.ref(`/status/${member.guild.id}`).once("value").then(status => {
            const data = status.val()
            if (!data) return
            if (!data.last) return
            if (data.enabled !== true) return
            client.channels.cache.get(data.last).setName(member.user.tag)
        })
    })
}
module.exports.help = {
    name: "status",
    category: "admin"
}
module.exports.aliases = ["statistics", "statystyki"]