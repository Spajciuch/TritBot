const Discord = require("discord.js")
const firebase = require("firebase")
const database = firebase.database()
module.exports.run = async (client) => {
    client.on("message", async message => {
        if (message.channel.name == "pool") {
            if (message.author.bot) return
            database.ref(`/settings/${message.guild.id}/embed_color`).once("value")
                .then(async color => {
                    const embed_color = color.val()
                    message.delete()
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Propozycja")
                        .setDescription(message.content)
                        .setFooter(`Propozycja użytkownika ${message.author.tag}`, message.author.displayAvatarURL())
                        .setColor(embed_color)
                    message.channel.send(embed).then(msg => {
                        msg.react("✅").then(r => {
                            msg.react("❌")
                        })
                    })
                })
        }
    })
}