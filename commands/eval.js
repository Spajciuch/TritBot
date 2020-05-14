var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color) => {
    if (message.author.id != "367390191721381890") return message.reply("Nie masz uprawnień")
    var result = eval(args.join(" "))
    let embed = new Discord.MessageEmbed()
        .setTitle("Eval")
        .addField(":inbox_tray: Wejście", "```" + args.join(" ") + "```", true)
        .addField(":outbox_tray: Wyjście", "```" + result + "```", true)
        .setColor(embed_color)
    message.channel.send(embed)
}
module.exports.help = {
    name: "eval",
}