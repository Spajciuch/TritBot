const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
  let online = message.guild.members.cache.filter(member => member.user.presence.status !== 'offline');
  let day = message.guild.createdAt.getDate()
  let month = 1 + message.guild.createdAt.getMonth()
  let year = message.guild.createdAt.getFullYear()
  let sicon = message.guild.iconURL();
  let serverembed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, sicon)
    .setThumbnail(sicon + "?size=2048")
    .setFooter(`${lang.commands.server.embeds.footers[0]} • ${day}.${month}.${year}`)
    .setColor(config.embed_color)
    .addField(lang.commands.server.embeds.fields[0], message.guild.name, true)
    .addField(lang.commands.server.embeds.fields[1], `${message.guild.owner}`, true)
    .addField(lang.commands.server.embeds.fields[2], message.guild.region, true)
    .addField(lang.commands.server.embeds.fields[3], message.guild.channels.cache.size, true)
    .addField(lang.commands.server.embeds.fields[4], message.guild.memberCount, true)
    .addField(lang.commands.server.embeds.fields[5], message.guild.memberCount - message.guild.members.cache.filter(m => m.user.bot).size, true)
    .addField(lang.commands.server.embeds.fields[6], message.guild.members.cache.filter(m => m.user.bot).size, true)
    .addField(lang.commands.server.embeds.fields[7], online.size, true)
    .addField(lang.commands.server.embeds.fields[8], message.guild.roles.cache.size, true);
  message.channel.send(serverembed);
}
module.exports.help = {
  name: "server",
  category: "info"
}
module.exports.aliases = ["server-info", "server_info"]