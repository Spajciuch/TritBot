const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(lang.commands.ban.replies.permission_error)

    const toBan = message.mentions.members.first()
    let reason = args.join(" ").slice(22)
    if (!reason) reason = lang.commands.ban.replies.no_reason

    if (!toBan) return message.reply(lang.commands.ban.replies.no_member)
    if (!toBan.bannable) return message.reply(lang.commands.ban.replies.cannot_ban)

    toBan.ban(reason + " -> " + message.author.tag)
        .then(() => {
            let embed = new Discord.MessageEmbed()
                .setColor("ff0037")
                .setAuthor("Ban", toBan.user.displayAvatarURL())
                .setDescription(lang.commands.ban.embeds.descriptions[0] + toBan.user.tag + lang.commands.ban.embeds.descriptions[1] + message.author.tag + "\n" + lang.commands.ban.embeds.descriptions[2] + "```" + reason + "```")
                .setTimestamp()
            message.channel.send(embed)
        })
        .catch(err => {
            message.reply(lang.commands.ban.replies.error)
            console.log(chalk.red(`[error] ${err}`))
        })
}

module.exports.help = {
    name: "ban",
    category: "admin"
}

module.exports.aliases = ["zbanuj"]