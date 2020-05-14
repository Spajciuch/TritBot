const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
  const giphy = require('giphy-api')(config.giphy);
  giphy.search(args.join(" "), function (err, res) {
    if (res.pagination.total_count == 0) return message.reply(lang.commands.gif.replies.cannot_find)

    let page = 1
    let embed = new Discord.MessageEmbed()
      .setColor(embed_color)
      .setTitle("Gif")
      .setImage(`https://media.giphy.com/media/${res.data[0].id}/giphy.gif`)
      .setFooter(`1 / ${res.data.length}`)
    message.channel.send(embed).then(msg => {

      msg.react('⏪').then(r => {
        msg.react('⏩')

        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(backwardsFilter);
        const forwards = msg.createReactionCollector(forwardsFilter);


        backwards.on('collect', r => {
          r.users.remove(message.author)
          if (page == 1) return;
          page--;
          embed.setFooter(`${page} / ${res.data.length}`);
          embed.setImage(`https://media.giphy.com/media/${res.data[page-1].id}/giphy.gif`)
          msg.edit(embed)
        })

        forwards.on('collect', r => {
          r.users.remove(message.author)
          if (page == res.data.length) return;
          page++;
          embed.setFooter(`${page} / ${res.data.length}`);
          embed.setImage(`https://media.giphy.com/media/${res.data[page-1].id}/giphy.gif`)
          msg.edit(embed)
        })

      })

    })

  });
}
module.exports.help = {
  name: "gif",
  category: "util"
}
module.exports.aliases = ["giphy"]