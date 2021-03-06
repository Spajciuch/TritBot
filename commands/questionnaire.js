const Discord = require("discord.js")
const config = require(`../config.json`)

module.exports.run = async (client, message, args, embed_color, lang) => {

    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.questionnaire.replies.permission_error)
    if (!args.join(" ")) return message.reply(lang.commands.questionnaire.replies.proper_use)

    //PYTANIE console.log(args.join(" ").split(" | ")[0].slice(21))
    let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setAuthor(lang.commands.questionnaire.embeds.titles[0], "https://cdn.discordapp.com/attachments/565189397000224779/569822027834458112/clever_emoji.png")
        .setTitle(args.join(" ").split(" | ")[0].slice(21))
    let description = lang.commands.questionnaire.embeds.descriptions[0]

    if (args.join(" ").split(" | ").length > 10) return message.reply(lang.commands.questionnaire.replies.too_much)

    for (var i = 1; i < args.join(" ").split(" | ").length; i++) {
        description += `[${i}] ` + args.join(" ").split(" | ")[i] + "\n"
    }

    embed.setDescription(description)
    const channel = client.channels.cache.get(args[0].replace("<#", "").replace(">", ""))

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

    try {
        channel.send(embed).then(msg => {
            for (var i = 0; i < args.join(" ").split(" | ").length -1; i++) {
               msg.react(emojis[i])
            }
        })
    } catch (err) {
        return message.reply(lang.commands.questionnaire.replies.proper_use)
    }
}
module.exports.help = {
    name: "questionnaire",
    category: "admin",
}
module.exports.aliases = ["ankieta"]