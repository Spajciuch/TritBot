const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply(lang.commands.kick.replies.permission_error)

    const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!toKick) return message.reply(lang.commands.kick.replies.no_mention)

    let reason = args.join(" ").slice(22)
    if (!reason) reason = lang.commands.kick.replies.no_reason

    toKick.kick(reason + " -> " + message.author.tag)
        .then(() => {
            let embed = new Discord.MessageEmbed()
                .setColor("#ffee00")
                .setAuthor("Kick", toKick.user.displayAvatarURL())
                .setDescription(lang.commands.kick.embeds.descriptions[0] + toKick.user.tag + lang.commands.kick.embeds.descriptions[1] + message.author + lang.commands.kick.embeds.descriptions[2] + "```" + reason + "```")
                .setTimestamp()
            message.channel.send(embed)
        })
        .catch(err => {
            message.reply(lang.commands.kick.replies.cannot_kick)
            console.log(chalk.red(`[error] ${err}`))
        })
}

module.exports.help = {
    name: "kick",
    category: "admin"
}

module.exports.aliases = ["wywal", "wykop"]