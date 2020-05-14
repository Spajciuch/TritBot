const Discord = require('discord.js')
var config = require('../config.json')
module.exports.run = async (client, message, args) => {
  if (message.author.id !== "367390191721381890") return
  const guildNames = client.guilds.map(g => g.name).join("\n");
  if (args.join(" ") == '') {
    const embed = {
      "description": guildNames,
      "color": config.neoney_color,
      "author": {
        "name": "Guilds with me on them"
      },
      "fields": [{
          "name": "To get invitation link",
          "value": "Use `guilds <guildnumber>`"
        }

      ]
    };
    message.channel.send({
      embed
    });
  } else {

    var numer = Number(args[0])
    if (!Number.isInteger(numer)) return message.reply('Not a number.');
    if (numer > client.guilds.size) return message.reply('Too big.');
    if (numer < 1) return message.reply('How would you use it?');
    client.guilds.array()[numer - 1].channels.filter(channel => channel.type !== 'category').first().createInvite()
      .then(invite => {
        let embed = new Discord.MessageEmbed()
          .setTitle("Invitation Link")
          .addField("Guild", client.guilds.array()[numer - 1])
          .addField("Link", "https://discord.gg/" + invite.code)
          .setColor(config.embed_color)
          .setFooter("Invitation Link")
        message.author.send({
          embed
        })
        message.channel.send('Check dm!')
          .then(message => message.delete(5000))
      })
      .catch(err => message.reply(err.message));
  }
}
module.exports.help = {
  name: "guildsy",
  category: "infoski"
}