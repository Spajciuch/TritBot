const Discord = require("discord.js")
const config = require("../config.json")
const superagent = require('superagent')
module.exports.run = async (client, message, args, embed_color, lang) => {
    let {
        body
    } = await superagent.get(`https://www.who-hosts-this.com/APIEndpoint/Detect?key=${config.who_api}&url=${args.join(" ")}`)
    let result = body.result
    let results = body.results[0]

    if (result.msg == "Invalid Url" || result.msg == "Failed: CMS or Host Not Found") return message.reply(lang.commands.who_host.replies.error)

    let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle(lang.commands.who_host.embeds.titles[0])
        .addField(lang.commands.who_host.embeds.fields[0], result.msg)
        .addField(lang.commands.who_host.embeds.fields[1], results.ip, true)
        .addField(lang.commands.who_host.embeds.fields[2], results.isp_name, true)
    message.channel.send(embed)
}
module.exports.help = {
    name: "who_host",
    category: "info"
}