const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("nie masz uprawnień")
    const database = require("firebase").database()

    if (args[0] == "start") {
        database.ref(`/dankmemes/${message.guild.id}`).set({
                channel: message.channel.id,
                enabled: true
            })
            .then(() => {
                message.reply(lang.commands.dankmemes.replies.start)
            })
            .catch(err => {
                message.reply(lang.commands.dankmemes.replies.error)
            })
    } else if (args[0] == "stop") {
        database.ref(`/dankmemes/${message.guild.id}`).remove()
            .then(() => {
                message.reply(lang.commands.dankmemes.replies.stop)
            })
            .catch(err => {
                message.reply(lang.commands.dankmemes.replies.error)
            })
    }
}
module.exports.start = async (client, embed_color) => {
    const database = require("firebase").database()
    client.on("message", message => {
        if (message.channel.id !== "587278303904137246") return
        if (message.author.discriminator == "0000") {
            client.guilds.cache.forEach(guild => {
                database.ref(`/dankmemes/${guild.id}`).once("value").then(data => {
                    const dankConfig = data.val()
                    if (!dankConfig) return
                    if (dankConfig.enabled !== true) return
                    let embed = new Discord.MessageEmbed()
                        .setColor(embed_color)
                        .setTitle(message.embeds[0].title)
                        .setURL(message.embeds[0].url)
                        .setImage(message.embeds[0].image.url)
                        .setDescription(message.embeds[0].description)
                    client.channels.cache.get(dankConfig.channel).send(embed)
                })
            })
        }
    })
}
module.exports.help = {
    name: "dankmemes",
    category: "util"
}
module.exports.aliases = ["memy", "r/dankmemes"]