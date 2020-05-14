const Discord = require("discord.js")
const {
    database
} = require("firebase")

const {
    stringify
} = require("../listeners/functions.js")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.antiRaid.replies.permission_error)

    database().ref(`anti-raid/${message.guild.id}`).once("value").then(d => {
        const data = d.val()
        let enabled
        if (d.val()) {
            enabled = data.enabled
        } else {
            enabled = false
        }
        if (!args[0]) {
            if (!enabled) {
                const channels = [""]
                const modules = JSON.parse(`{"inviteModule":{"enabled": true}, "messageModule": {"enabled": true}}`)

                database().ref(`anti-raid/${message.guild.id}`).set({
                        enabled: true,
                        modules: modules,
                        channels: channels
                    })
                    .then(() => {
                        message.reply(lang.commands.antiRaid.replies.enable)
                    })
            } else {
                database().ref(`anti-raid/${message.guild.id}`).set({
                        enabled: false,
                        modules: data.modules,
                        channels: data.channels
                    })
                    .then(() => {
                        message.reply(lang.commands.antiRaid.replies.disable)
                    })
            }
        } else {
            let spamStatus
            let inviteStatus
            let enabledStatus = enabled

            if (d.val()) {
                spamStatus = data.modules.messageModule.enabled
                inviteStatus = data.modules.inviteModule.enabled
            } else {
                spamStatus = false
                inviteStatus = false
            }

            spamStatus = spamStatus.toString().replace("true", "<:on_emoji:631519148102516745>")
            spamStatus = spamStatus.toString().replace("false", "<:off_emoji:631519148186402828>")

            inviteStatus = inviteStatus.toString().replace("true", "<:on_emoji:631519148102516745>")
            inviteStatus = inviteStatus.toString().replace("false", "<:off_emoji:631519148186402828>")

            enabledStatus = enabledStatus.toString().replace("true", "<:on_emoji:631519148102516745>")
            enabledStatus = enabledStatus.toString().replace("false", "<:off_emoji:631519148186402828>")

            const channels = data.channels
            if (channels[0] !== "") {
                for (var i = 0; i <= channels.length - 1; i++) {
                    channels[i] = `<#${channels[i]}>`
                }
            }
            let channelsString = stringify(channels, "", "\n", "---")

            if (args[0] == "configure") {
                let embed = new Discord.MessageEmbed()
                    .setColor(embed_color)
                    .setAuthor(lang.commands.antiRaid.embeds.titles[0], message.guild.iconURL())
                    .addField(lang.commands.antiRaid.embeds.fields[0], lang.commands.antiRaid.embeds.fields[3] + ": " + enabledStatus)
                    .addField(lang.commands.antiRaid.embeds.fields[1], lang.commands.antiRaid.embeds.fields[3] + ": " + spamStatus, true)
                    .addField(lang.commands.antiRaid.embeds.fields[2], lang.commands.antiRaid.embeds.fields[3] + ": " + inviteStatus, true)
                    .addField(lang.commands.antiRaid.embeds.fields[4], channelsString || "---")

                if (!args[1]) {
                    message.channel.send(embed).then(() => {
                        message.channel.send(lang.commands.antiRaid.embeds.descriptions[0])
                    })
                } else if (args[1] == "inviteModule") {
                    if (args[2] == "on") {
                        const modules = JSON.parse(`{"inviteModule":{"enabled": true}, "messageModule": {"enabled": ${data.modules.messageModule.enabled || true}}}`)

                        database().ref(`anti-raid/${message.guild.id}`).set({
                                enabled: enabled,
                                modules: modules,
                                channels: data.channels
                            })
                            .then(() => {
                                message.reply(lang.commands.antiRaid.replies.enableInvite)
                            })
                    } else if (args[2] == "off") {
                        const modules = JSON.parse(`{"inviteModule":{"enabled": false}, "messageModule": {"enabled": ${data.modules.messageModule.enabled}}}`)

                        database().ref(`anti-raid/${message.guild.id}`).set({
                                enabled: enabled,
                                modules: modules,
                                channels: data.channels
                            })
                            .then(() => {
                                message.reply(lang.commands.antiRaid.replies.disableInvite)
                            })
                    }
                } else if (args[1] == "spamModule") {
                    if (args[2] == "on") {
                        // console.log(`{"inviteModule":{"enabled": ${data.modules.inviteModule.enabled}}, "messageModule": {"enabled": true}}}`)
                        const modules = JSON.parse(`{"inviteModule":{"enabled": ${data.modules.inviteModule.enabled}}, "messageModule": {"enabled": true}}`)

                        database().ref(`anti-raid/${message.guild.id}`).set({
                                enabled: enabled,
                                modules: modules,
                                channels: data.channels
                            })
                            .then(() => {
                                message.reply(lang.commands.antiRaid.replies.enableMessage)
                            })
                    } else if (args[2] == "off") {
                        // console.log(`{"inviteModule":{"enabled": ${data.modules.inviteModule.enabled}}, "messageModule": {"enabled": true}}`)
                        const modules = JSON.parse(`{"inviteModule":{"enabled": ${data.modules.inviteModule.enabled}}, "messageModule": {"enabled": false}}`)
                        database().ref(`anti-raid/${message.guild.id}`).set({
                                enabled: enabled,
                                modules: modules,
                                channels: data.channels
                            })
                            .then(() => {
                                message.reply(lang.commands.antiRaid.replies.disableMessage)
                            })
                    }
                } else if (args[1] == "ignoredChannels") {
                    database().ref(`anti-raid/${message.guild.id}`).once("value").then(data => {
                        if (!data.val()) return
                        let raidSettings = data.val()

                        let argsString = args.join(" ")
                        database().ref(`anti-raid/${message.guild.id}/channels`).once("value").then(d => {
                            let channels = Array(0)
                            if (d.val() && d.val()[0] !== "") channels = d.val()
                            if (args[2] == "add") {
                                channels[channels.length] = argsString.replace("configure ", "").replace("ignoredChannels ", "").replace("add ", "").replace("<#", "").replace(">", "")
                                database().ref(`anti-raid/${message.guild.id}`).set({
                                    channels: channels,
                                    enabled: raidSettings.enabled,
                                    modules: raidSettings.modules
                                }).then(() => {
                                    message.reply(lang.commands.antiRaid.replies.channelAdded)
                                })
                            } else if (args[2] == "remove") {
                                const channelId = argsString.replace("configure ", "").replace("ignoredChannels ", "").replace("remove ", "").replace("<#", "").replace(">", "")
                                if (!channels.includes(channelId)) return message.reply(lang.commands.antiRaid.replies.noId)

                                const index = channels.indexOf(channelId)
                                channels.splice(index, 1)

                                if (channels.length < 1) channels = [""]

                                database().ref(`anti-raid/${message.guild.id}`).set({
                                    channels: channels,
                                    enabled: raidSettings.enabled,
                                    modules: raidSettings.modules
                                }).then(() => {
                                    message.reply(lang.commands.antiRaid.replies.channelRemoved)
                                })
                            }
                        })
                    })
                }
            }
        }
    })
}
module.exports.help = {
    name: "antiRaid",
    category: "admin"
}
module.exports.aliases = ["antiraid", "anti-raid", "antyRaid"]