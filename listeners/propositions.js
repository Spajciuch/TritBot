const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client) => {
    const {
        database
    } = require("firebase")

    client.on("message", message => {
        if (!message.guild) return;
        if (message.author.id == client.user.id) return;

        database().ref(`/propositions/${message.guild.id}/channel`).once("value").then(data => {
            const channelId = data.val()
            if (!channelId) return;
            if (message.channel.id != channelId) return;

            const {
                database
            } = require("firebase")


            database().ref(`/settings/${message.guild.id}`).once("value").then(data => {
                const settings = data.val()
                const channel = client.channels.cache.get(channelId)

                const commandName = [`${settings.prefix}propozycje`, `${settings.prefix}ideas`, `${settings.prefix}propositions`]

                if (commandName.includes(message.content)) return;

                let lang
                const embed_color = settings.embed_color

                if (settings.language == "PL") lang = require("../languages/pl.json")
                else lang = require("../languages/en.json")


                let embed = new Discord.MessageEmbed()
                    .setColor(embed_color)
                    .setAuthor(lang.commands.propositions.embeds.titles[0] + message.author.tag, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setTimestamp()

                message.delete()
                    .then(() => {
                        channel.send(embed).then(msg => {
                            msg.react("✅").then(() => msg.react("❌"))
                        })
                    })
                    .catch(err => {
                        message.guild.owner.send(lang.commands.propositions.replies.noPermissions + `<#${channel.id}>`)
                        console.log(chalk.red(`[error] ${err}`))
                    })
            })
        })
    })
}