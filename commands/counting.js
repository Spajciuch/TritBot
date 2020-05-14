const Discord = require("discord.js")
const chalk = require("chalk")
module.exports.run = async (client, message, args, embed_color, lang) => {
	if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(lang.commands.counting.replies.permission_error)

	const database = require("firebase").database()

	database.ref(`counting/${message.guild.id}`).once("value").then(data => {
		if (!data.val()) {
			database.ref(`counting/${message.guild.id}`).set({
					channel: message.channel.id,
					last: 0,
				})
				.then(() => {
					message.reply(lang.commands.counting.replies.succes)
					message.channel.setTopic(lang.commands.counting.replies.next + " **" + 1 + "**")
				})
				.catch(err => {
					console.log(chalk.red("[error] " + err))
					message.reply(lang.commands.counting.replies.error)
				})
		} else if (data.val()) {
			database.ref(`counting/${message.guild.id}`).remove()
				.then(() => {
					message.reply(lang.commands.counting.replies.off)
				})
		}
	})
}
module.exports.start = async (client) => {
	const database = require("firebase").database()

	client.on("message", message => {
		if (message.author.bot) return;
		if (message.channel.type == "dm") return;
		database.ref(`/settings/${message.guild.id}/language`).once("value").then(l => {

			database.ref(`/counting/${message.guild.id}`).once("value").then(data => {
				let lang

				if (l.val() == "PL") lang = require("../languages/pl.json")
				else lang = require("../languages/en.json")
				if (!data.val()) return;

				const config = data.val()

				if (message.content.includes("liczenie") || message.content.includes("counting")) return;
				if (message.channel.id !== config.channel) return;
				if (isNaN(message.content)) return message.delete()

				let number = config.number || 0

				if (Number(message.content) !== Number(number) + 1) return message.delete()

				const next = Number(message.content) + 1

				message.channel.setTopic(lang.commands.counting.replies.next + " **" + next + "**")

				database.ref(`/counting/${message.guild.id}`).set({
					channel: message.channel.id,
					number: message.content
				})
			})
		})
	})
}

module.exports.help = {
	name: "counting",
	category: "util"
}
module.exports.aliases = ["liczenie"]