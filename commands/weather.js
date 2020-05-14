var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
  var weather = require("weather-js")

  weather.find({
    search: args.join(" ") || "warsaw",
    degreeType: 'C'
  }, function (err, currentult) {
    if (err) return message.reply(lang.commands.weather.replies.error)
    var current = currentult[0].current
    var location = currentult[0].location
    let embed = new Discord.MessageEmbed()
      .setTitle(lang.commands.weather.embeds.titles[0] + current.observationpoint)
      .setColor(embed_color)
      .setThumbnail(current.imageUrl)
      .setFooter(lang.commands.weather.embeds.footers[0] + current.observationtime)
      .addField(lang.commands.weather.embeds.fields[0], current.feelslike + "°C", true)
      .addField(lang.commands.weather.embeds.fields[1], current.temperature + "°C", true)
      .addField(lang.commands.weather.embeds.fields[2], current.humidity + "%", true)
      .addField(lang.commands.weather.embeds.fields[3], current.windspeed, true)
      .addField(lang.commands.weather.embeds.fields[4], "UTC " + location.timezone, true)
    message.channel.send(embed)
  });
}
module.exports.help = {
  name: "weather",
  category: "info"
}
module.exports.aliases = ["pogoda"]