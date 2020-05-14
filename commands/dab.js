const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
if(message.mentions.members.first()){
    message.channel.send({
		files: [{
	   attachment:`https://tritbot.glitch.me/canvas/dab/${message.mentions.members.first().user.id}`,
	   name:"dab.png"
	   }]
		})
} else {
	message.channel.send({
		files: [{
	   attachment:`https://tritbot.glitch.me/canvas/dab/${message.author.id}`,
	   name:"dab.png"
	   }]
		})
}
}
module.exports.help = {
	name: "dab",
	category:"util"
}

module.exports.aliases = ["dabowanie"]