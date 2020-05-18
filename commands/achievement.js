const Discord = require("discord.js")
const snekfetch = require("snekfetch")

module.exports.run = async (client, message, args, embed_color, lang) => {

    function includesPolisChars(string) {
        let state = false
        string = string.toLowerCase()

        if (string.includes("ą")) state = true
        if (string.includes("ć")) state = true
        if (string.includes("ę")) state = true
        if (string.includes("ł")) state = true
        if (string.includes("ń")) state = true
        if (string.includes("ó")) state = true
        if (string.includes("ś")) state = true
        if (string.includes("ź")) state = true
        if (string.includes("ż")) state = true

        return state
    }

    if (includesPolisChars(message.content)) return message.reply(lang.commands[this.help.name].replies)

    const {
        body: buffer
    } = await snekfetch.get(`https://www.minecraftskinstealer.com/achievement/a.php?i=2&h=Achievement+Get%21&t=${args.join("+")}`)

    const attachment = new Discord.MessageAttachment(buffer, "achievement.png")
    message.channel.send(attachment)
}

module.exports.help = {
    name: "achievement",
    category: "util"
}

module.exports.aliases = ["minecraft"]