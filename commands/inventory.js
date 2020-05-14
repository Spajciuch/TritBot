const Discord = require("discord.js")
const database = require("firebase").database()
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
	if (!args[0]) {
		database.ref(`/economy/${message.guild.id}/${message.author.id}`).once("value").then(data => {
			if (!data.val()) return message.reply(lang.commands.inventory.replies.empty)
			const account = data.val()
			if (!account.inventory) return message.reply(lang.commands.inventory.replies.empty)
			const inventory = account.inventory

			let embed = new Discord.MessageEmbed()
				.setAuthor(lang.commands.inventory.embeds.titles[0] + message.author.tag, message.author.displayAvatarURL())
				.setColor(embed_color)
				.setTimestamp()
			let description = ""

			for (var i = 0; i <= inventory.length - 1; i++) {
				description += `**${i+1}.** ${inventory[i].replace("role", "")}\n`
			}

			embed.setDescription(description)
			message.channel.send(embed)

		})
	} else if (args[0] == "use") {
		database.ref(`/economy/${message.guild.id}/${message.author.id}`).once("value").then(data => {
			if (!data.val()) return message.reply(lang.commands.inventory.replies.empty)
			const account = data.val()
			if (!account.inventory) return message.reply(lang.commands.inventory.replies.empty)
			const inventory = account.inventory

			if (isNaN(args[1])) {
				const position = inventory.indexOf(args.join(" ").replace("use ", ""))
				const used = inventory[position]

				if (position < 0) return message.reply(lang.commands.inventory.replies.cannot_find)
				inventory.splice(position, 1)
				database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
						inventory: inventory,
						lastDaily: account.lastDaily || null,
						lastWork: account.lastWork || null,
						bucks: account.bucks || null
					})
					.then(() => {
						message.reply(`${lang.commands.inventory.replies.used}**` + used.replace("role ", "") + "**")
						if (used.startsWith("<@&")) {
							const role = message.guild.roles.cache.get(used.replace("role ", "").replace("<@&", "").replace(">", ""))
							message.member.roles.add(role)
						}
					})
					.catch(err => {
						message.reply(lang.commands.inventory.replies.error + " ```" + err + "```")
						console.log(chalk.red(`[error] ${err}`))
					})
			} else {
				const position = args[1] - 1

				if (position < 0 || position > inventory.length) return message.reply(lang.commands.inventory.replies.wrong_number + inventory.length + "**")
				const deleted = inventory[position]

				inventory.splice(position, 1)
				database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
						inventory: inventory,
						lastDaily: account.lastDaily || null,
						lastWork: account.lastWork || null,
						bucks: account.bucks || null
					})
					.then(() => {
						message.reply(`${lang.commands.inventory.replies.used} **` + deleted + "**")
						const role = message.guild.roles.cache.get(deleted.replace("role ", "").replace("<@&", "").replace(">", ""))
						message.member.roles.add(role)
					})
					.catch(err => {
						message.reply(lang.commands.inventory.replies.error + " ```" + err + "```")
						console.log(chalk.red(`[error] ${err}`))
					})
			}
		})
	} else if (args[0] == "clear") {
		message.channel.send(lang.commands.inventory.replies.warning).then(msg => {
			msg.react("✅").then(r => {
				msg.react("❌")
				const acceptFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
				const cancelFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

				const accept = msg.createReactionCollector(acceptFilter);
				const cancel = msg.createReactionCollector(cancelFilter);

				accept.on('collect', r => {
					database.ref(`/economy/${message.guild.id}/${message.author.id}`).remove()
						.then(() => {
							message.reply(lang.commands.inventory.replies.cleared)

						})
						.catch(err => {
							message.reply(lang.commands.inventory.replies.error + " ```" + err + "```")
							console.log(chalk.red(`[error] ${err}`))
						})
				})

				cancel.on('collect', r => {
					message.channel.send(lang.commands.inventory.replies.canceled + " ✅").then(m => {
						message.delete(500)
						msg.delete()
						m.delete()
					})
				})
			})
		})
	}
}

module.exports.help = {
	name: "inventory",
	category: "economy"
}

module.exports.aliases = ["plecak", "magazyn", "przedmioty", "ekwipunek"]