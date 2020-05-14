const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client) => {
    const {
        database
    } = require("firebase")

    client.on("message", message => {
        if (!message.guild) return;
        if (message.author.id == client.user.id) return;

        database().ref(`/anon/${message.guild.id}/channel`).once("value").then(data => {
            const channelId = data.val()
            if (!channelId) return;
            if (message.channel.id != channelId) return;

            const {
                database
            } = require("firebase")


            database().ref(`/settings/${message.guild.id}/language`).once("value").then(l => {
                database().ref(`/settings/${message.guild.id}/embed_color`).once("value").then(ebc => {
                    database().ref(`/settings/${message.guild.id}/prefix`).once("value").then(pfx => {
                        const prefix = pfx.val()
                        const la = l.val()
                        const embed_color = ebc.val()
                        const channel = client.channels.cache.get(channelId)

                        const commandName = [`${prefix}anon`, `${prefix}anonimowy`]

                        if (commandName.includes(message.content)) return;

                        let lang

                        if (la == "PL") lang = require("../languages/pl.json")
                        else lang = require("../languages/en.json")


                        let embed = new Discord.MessageEmbed()
                            .setColor(embed_color)
                            .setAuthor(lang.commands.anon.embeds.titles[0])
                            .setDescription(message.content)
                            .setTimestamp()

                        message.delete()
                            .then(() => {
                                channel.send(embed).then(msg => {})
                            })
                            .catch(err => {
                                message.guild.owner.send(lang.commands.anon.replies.noPermissions + `<#${channel.id}>`)
                                console.log(chalk.red(`[error] ${err}`))
                            })
                    })
                })
            })
        })
    })
}