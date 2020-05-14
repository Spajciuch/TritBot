var Discord = require("discord.js")
var config = require(`../config.json`)
const chalk = require("chalk")
module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(lang.commands.ban.replies.permission_error)
    let everyone = message.guild.roles.cache.find(r => r.name == "@everyone");
    await message.channel.overwritePermissions([{
            id: everyone.id,
            deny: ['SEND_MESSAGES', "ADD_REACTIONS"],
        }, ], 'Needed to change permissions')
        .then(() => {
            message.reply(lang.commands.lock.replies.done)
            message.react("🚦")
        })
        .catch(err => {
            message.reply(lang.commands.lock.replies.error + " ```" + err + "```")
            console.log(chalk.red("[error] " + err))
        })
}
module.exports.help = {
    name: "lock",
    category: "admin"
}
module.exports.aliases = ["zablokuj"]
