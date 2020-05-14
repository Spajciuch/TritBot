const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    const ms = require('parse-ms')
    const cooldown = 9000000
    const firebase = require("firebase")
    const database = firebase.database()
    database.ref(`/economy/${message.guild.id}/${message.author.id}/bucks`).once("value")
        .then(async bucks => {
            database.ref(`/economy/${message.guild.id}/${message.author.id}/inventory`).once("value")
                .then(async inventory => {
                    database.ref(`/economy/${message.guild.id}/${message.author.id}/lastdaily`).once("value")
                        .then(async lastdaily => {
                            database.ref(`/economy/${message.guild.id}/${message.author.id}/lastwork`).once("value")
                                .then(async lastwork => {

                                    const lastWork = lastwork.val()
                                    if (lastWork !== null && (cooldown - (Date.now() - lastWork)) > 0) {
                                        let timeObj = ms(cooldown - (Date.now() - lastWork))
                                        let embed = new Discord.MessageEmbed()
                                            .setAuthor("Work", message.author.displayAvatarURL())
                                            .setDescription(`${lang.commands.work.embeds.descriptions[0]} **${timeObj.hours}h ${timeObj.minutes}m**!`)
                                            .setColor(embed_color)
                                        return message.channel.send({
                                            embed
                                        })
                                    }
                                    // const work = require('../config/work.json')
                                    const job = lang.jobs
                                    const which = Math.floor(Math.random() * lang.jobs.length);
                                    let payment = lang.payment[which]
                                    payment = Number(payment)
                                    let finalPayment = Math.floor(Math.random() * payment) + payment
                                    database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
                                        inventory: inventory.val(),
                                        lastwork: Date.now(),
                                        lastdaily: lastdaily.val(),
                                        bucks: bucks.val() + Number(finalPayment)
                                    })
                                    let embed = new Discord.MessageEmbed()
                                        .setAuthor("Work", message.author.displayAvatarURL())
                                        .addField(lang.commands.work.embeds.fields[0] + job[which] + lang.commands.work.embeds.fields[1], finalPayment + "<:coin:565840795748401152>")
                                        .addField(lang.commands.work.embeds.fields[2], bucks.val() + Number(finalPayment) + "<:coin:565840795748401152>")
                                        .setColor(embed_color)
                                    message.channel.send({
                                        embed
                                    })

                                })
                        })
                })
        })
}
module.exports.help = {
    name: "work",
    category: "economy"
}
module.exports.aliases = ["pracuj", "praca"]