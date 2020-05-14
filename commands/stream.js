const Discord = require("discord.js")
const config = require(`../config.json`)
const chalk = require("chalk")
module.exports.run = async (client, message, args, embed_color, lang) => {
    const database = require("firebase").database()
    database.ref(`/settings/${message.guild.id}/prefix`).once("value").then(pfx => {
        const prefix = pfx.val()
        const channel = message.member.voice
        if (!channel) return message.reply(lang.commands.stream.replies.no_channel)
        const broadcast = client.createVoiceBroadcast();
        const stations = ["100% Hits", "500 Party Hits"]
        const id = ["64", "81", ]
        if (args[0] == "openfm") {
            channel.join()
                .then(connection => {
                    let string = ""
                    for (var i = 1; i <= args.length - 1; i++) {
                        string += " " + args[i]
                    }
                    string = string.replace(" ", "")
                    if (stations.indexOf(string) == -1) {
                        message.reply(lang.commands.stream.replies.no_proper_name)
                        let embed = new Discord.MessageEmbed()
                            .setColor(embed_color)
                            .setTitle(lang.commands.stream.embeds.titles[0])
                            .addField(lang.commands.stream.embed.fields[0], lang.commands.stream.embed.fields[1])
                        let description = ""
                        for (var i = 0; i <= stations.length - 1; i++) {
                            description += stations[i] + "\n"
                        }
                        embed.setDescription(description)
                        return message.channel.send(embed)
                    }
                    broadcast.playStream(`http://stream.open.fm/${id[stations.indexOf(string)]}`)
                    message.reply()
                    const dispatcher = connection.playBroadcast(broadcast);
                    const filter = msg => msg.content.includes(prefix);
                    const collector = new Discord.MessageCollector(message.channel, filter);
                    collector.on("collect", msg => {
                        if (msg.content == `${prefix}leave`) {
                            channel.leave()
                            collector.stop()
                        }
                    })
                })
                .catch(err => {
                    message.reply(lang.commands.stream.replies.error + err + "```")
                    console.log(chalk.red("[error] " + err))
                })
        } else if (args[0] == "custom") {
            channel.join()
                .then(connection => {
                    broadcast.playStream(`${args[1]}`);
                    const dispatcher = connection.playBroadcast(broadcast);
                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
}
module.exports.help = {
    name: "stream",
    category: "util"
}
//http://stream.open.fm/64