var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    message.delete({
        timeout: 1500
    })
    let ascii_text_generator = require('ascii-text-generator');
    let input_text = args.join(" ")
    let ascii_text = ascii_text_generator(input_text, "2");
    message.channel.send("```" + ascii_text + "```");
}
module.exports.help = {
    name: "ascii",
    category: "util"
}