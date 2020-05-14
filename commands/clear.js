var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(lang.commands.clear.replies.permission_error);

  if (!args[0]) return message.channel.send(lang.commands.clear.replies.no_args);

  if (args[0] > 100 || args[0] < 1) return message.reply(lang.commands.clear.replies.range)
  message.channel.bulkDelete(Number(args[0]) + 1)
  message.channel.send("Usunięto " + args[0] + " wiadomości").then(msg => msg.delete({
    timeout: 2000
  }))
}
module.exports.help = {
  name: "clear",
  category: "admin"
}
module.exports.aliases = ["prune", "wyczyść"]