const Discord = require("discord.js")
const { database } = require("firebase")
module.exports.run = async (client) => {
    client.on("guildMemberAdd", member => {
        database().ref(`/settings/${member.guild.id}`).once("value").then(d => {
            const settings = d.val()

            database().ref(`/card/${member.guild.id}/enabled`).once("value").then(async d => {
                const state = d.val()
                if (state == true) {
                    const {
                        createCanvas,
                        loadImage
                    } = require('canvas')

                    const snekfetch = require("snekfetch")

                    const canvas = createCanvas(500, 250)
                    const ctx = canvas.getContext('2d')

                    const {
                        body: buffer
                    } = await snekfetch.get(member.user.displayAvatarURL().replace("webp", "png"))

                    const avt = await loadImage(buffer);
                    ctx.drawImage(avt, 30, 23, 90, 90);

                    const bkg = await loadImage("./photos/welcome_card.png");
                    ctx.drawImage(bkg, 0, 0, 500, 250)

                    ctx.textAlign = "left";

                    ctx.font = `35px "MuseoModerno"`
                    ctx.fillStyle = "#625b5b";

                    if (settings.language == "PL") ctx.fillText("Witaj na serwerze", 158, 70)
                    else {
                        ctx.font = `29px "MuseoModerno"`
                        ctx.fillText("Welcome to the server", 158, 70)
                    } 
                    ctx.font = `35px "MuseoModerno"`
                    ctx.fillText(`${member.user.username}#${member.user.discriminator}`, 30, 150)

                    if (!client.channels.cache.get(settings.wchan)) return

                    const channel = client.channels.cache.get(settings.wchan)
                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png")

                    channel.send(attachment)
                }
            })
        })
    })
}