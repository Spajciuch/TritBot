const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
	if (!args.join(" ")) return message.reply(lang.commands.ball.replies)
	const answersList = lang.responses
	const answers = lang.responses
	var choose = Math.floor(Math.random() * answers.length)
	message.reply(answers[choose])
}
module.exports.help = {
	name: "ball",
	category: "util"
}
module.exports.aliases = ["eigthball", "pytanie", "losuj"]