var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
  let everyone = message.guild.roles.cache.find(r => r.name == "@everyone");
  await message.channel.overwritePermissions([{
    id: everyone.id,
    allow: ['SEND_MESSAGES', "ADD_REACTIONS"],
  }, ], 'Needed to change permissions')
  message.reply(lang.commands.unlock.replies.success)
  message.react("🚦")
}
module.exports.help = {
  name: "unlock",
  category: "admin"
}
module.exports.aliases = ["odblokuj"]