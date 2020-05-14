const Discord = require("discord.js")
module.exports.start = async (client) => {
  const database = require("firebase").database()
  client.on("message", message => { //Listener odpowiadający za XP
    if (message.channel.type == "dm") return
    if (message.guild.id == "264445053596991498") return
    if (message.channel.id == "615488656731537419" || message.channel.id == "622564416533299200" || message.channel.id == "624262960654581760" || message.channel.id == "624996788641988618") return;
    database.ref(`/settings/${message.guild.id}/leveling`).once("value")
      .then(async leveling => {
        if (leveling.val() == false) return
        if (message.author.bot) return
        var defaultLevel = 1
        var forLevel = 10
        database.ref(`/users/${message.guild.id}/${message.author.id}/mesagesCount`).once('value')
          .then(async count => {
            database.ref(`/users/${message.guild.id}/${message.author.id}/level`).once('value')
              .then(async lvl => {
                database.ref(`/economy/${message.guild.id}/${message.author.id}/bucks`).once("value")
                  .then(async bucks => {
                    database.ref(`/economy/${message.guild.id}/${message.author.id}/lastdaily`).once("value")
                      .then(async lastdaily => {
                        database.ref(`/economy/${message.guild.id}/${message.author.id}/lastwork`).once("value")
                          .then(async lastwork => {
                            database.ref(`/economy/${message.guild.id}/${message.author.id}/inventory`).once("value")
                              .then(async inventory => {
                                database.ref(`/settings/${message.guild.id}/embed_color`).once("value")
                                  .then(async embed_color => {


                                    var level = Number(lvl.val())
                                    if (count.val() >= forLevel * level * level) {
                                      level += 1
                                      let embed = new Discord.MessageEmbed()
                                        .setColor(embed_color.val())
                                        .setDescription("+ 100<:coin:565840795748401152>")
                                        .setAuthor("Level up!", message.author.displayAvatarURL())
                                        .addField(`Level`, level, true)
                                        .addField(`XP`, count.val() || 1 + '/' + forLevel * level * level, true)
                                      if (leveling.val() == false) return
                                      // message.channel.send(embed).then(msg => {
                                      //   msg.delete(6000)
                                      // })
                                      database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
                                        "bucks": Number(bucks.val()) + 100,
                                        "inventory": inventory.val(),
                                        "lastwork": lastwork.val(),
                                        "lastdaily": lastdaily.val()
                                      })
                                    }
                                    let curr = count.val()
                                    if (!curr) curr = 0
                                    database.ref(`/users/${message.guild.id}/${message.author.id}`).set({
                                      "mesagesCount": curr + 1,
                                      "level": level
                                    })
                                  })
                              })
                          })
                      })
                  })
              })
          })
      })
  })
}