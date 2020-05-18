const Discord = require("discord.js")
const database = require("firebase").database()
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
	const replies = lang.commands[this.help.name].replies

	if (!args[0]) {
		database.ref(`/store/${message.guild.id}`).once("value").then(async data => {
			if (!data.val()) return message.reply(replies.no_store)
			const store = data.val()

			const items = store.items
			const price = store.price

			let embed = new Discord.MessageEmbed()
				.setColor(embed_color)
				.setTimestamp()
				.setAuthor(lang.commands.store.embeds.titles[0], message.guild.iconURL())

			let description = ""

			for (var i = 0; i <= items.length - 1; i++) {
				description += `**${i+1}.** ` + items[i].replace("role ", "") + " **->** " + price[i] + "<:coin:565840795748401152>" + "\n"
			}

			embed.setDescription(description)
			message.channel.send(embed)
		})
	} else if (args[0] == "add") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(replies.permission_error)
		database.ref(`/store/${message.guild.id}`).once("value").then(async data => {
			if (!data.val()) {
				if (!args.join(" ").split(" | ")[0] || !args.join(" ").split(" | ")[1]) return message.reply(replies.proper_use_add)
				if (isNaN(args.join(" ").split(" | ")[1])) return message.reply(replies.price_NaN)

				const items = [args.join(" ").split(" | ")[0].replace("add ", "")]
				const price = [args.join(" ").split(" | ")[1]]

				database.ref(`/store/${message.guild.id}`).set({
						items: items,
						price: price
					})
					.then(() => {
						message.reply(`${replies.added[0]} **${items[0]}** ${replies.added[1]} **${price[0]}**<:coin:565840795748401152>`)
					})
					.catch(err => {
						message.reply(replies.error + err + "```")
						console.log(chalk.red(`[error] ${err}`))
					})
			} else {
				if (!args.join(" ").split(" | ")[0] || !args.join(" ").split(" | ")[1]) return message.reply(replies.proper_use_add)
				if (isNaN(args.join(" ").split(" | ")[1])) return message.reply(replies.price_NaN)

				const store = data.val()

				const items = store.items
				const price = store.price

				items[items.length] = args.join(" ").split(" | ")[0].replace("add ", "")
				price[price.length] = args.join(" ").split(" | ")[1]

				database.ref(`/store/${message.guild.id}`).set({
						items: items,
						price: price
					})
					.then(() => {
						message.reply(`${replies.added[0]} **${items[items.length -1]}** ${replies.added[1]} **${price[price.length -1]}**<:coin:565840795748401152>`)
					})
					.catch(err => {
						message.reply(replies.error + err + "```")
						console.log(chalk.red(`[error] ${err}`))
					})
			}
		})
	} else if (args[0] == "buy") {
		database.ref(`/store/${message.guild.id}`).once("value").then(data => {
			if (!data.val()) return message.reply(replies.no_store)
			if (!args[1]) return message.reply(replies.to_buy)

			const store = data.val()

			const items = store.items
			const price = store.price

			if (isNaN(args[1])) {
				const item = args.join(" ").replace("buy ", "")
				const position = items.indexOf(item)

				if (position < 0) return message.reply(replies.notfound)

				database.ref(`/economy/${message.guild.id}/${message.author.id}/`).once("value").then(economyData => {
					const account = economyData.val()
					let inventory
					if (!economyData.val()) return message.reply(replies.no_credits)
					if (!account.inventory) inventory = []
					else inventory = account.inventory

					const bucks = account.bucks

					if (bucks < price[position]) return message.reply(replies.no_credits)
					inventory[inventory.length] = items[position]

					database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
							bucks: bucks - price[position],
							lastDaily: account.lastDaily || null,
							lastWork: account.lastWork || null,
							inventory: inventory
						})
						.then(() => {
							message.reply(replies.bought + items[position] + "**")
						})
						.catch(err => {
							message.reply(replies.error + err + "```")
							console.log(chalk.red(`[error] ${err}`))
						})
				})
			} else {
				const item = args.join(" ").replace("buy ", "") - 1
				if (item > items.length - 1 || item < 0) return message.reply(replies.range + items.length)

				database.ref(`/economy/${message.guild.id}/${message.author.id}`).once("value").then(economyData => {
					let inventory
					const account = economyData.val()
					if (!economyData.val()) return message.reply(replies.no_credits)
					if (!account.inventory) inventory = []
					else inventory = account.inventory

					if (account.bucks < price[item]) return message.reply(replies.no_credits)
					inventory[inventory.length] = items[item]

					database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
							lastDaily: account.lastDaily || null,
							lastWork: account.lastWork || null,
							inventory: inventory,
							bucks: account.bucks - price[item]
						})
						.then(() => {
							message.reply(replies.bought + items[item] + "**")
						})
						.catch(err => {
							message.reply(replies.error + err + "```")
							console.log(chalk.red(`[error] ${err}`))
						})
				})
			}
		})
	} else if (args[0] == "clear") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(replies.permission_error)

		message.channel.send(replies.warning).then(msg => {
			msg.react("✅").then(r => {
				msg.react("❌")
				const acceptFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
				const cancelFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

				const accept = msg.createReactionCollector(acceptFilter);
				const cancel = msg.createReactionCollector(cancelFilter);

				accept.on('collect', r => {
					database.ref(`/store/${message.guild.id}`).remove()
						.then(() => {
							message.reply(replies.cleared)

						})
						.catch(err => {
							message.reply(replies.error + err + "```")
							console.log(chalk.red(`[error] ${err}`))
						})
				})

				cancel.on('collect', r => {
					message.channel.send(replies.canceled).then(m => {
						message.delete(500)
						msg.delete()
						m.delete()
					})
				})
			})
		})

	} else if (args[0] == "remove") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(replies.permission_error)
		if (!args[1]) return message.reply(replies.no_args)
		if (isNaN(args[1])) {
			database.ref(`/store/${message.guild.id}`).once("value").then(data => {
				if (!data.val()) return message.reply(replies.no_store)
				const store = data.val()
				const items = store.items
				const price = store.price
				const position = items.indexOf(args.join(" ").replace("remove ", ""))

				if (position < 0) return message.reply(replies.notfound)

				items.splice(position, 1)
				price.splice(position, 1)

				database.ref(`/store/${message.guild.id}`).set({
						items: items,
						price: price
					})
					.then(() => {
						message.reply(replies.deleted + args.join(" ").replace("remove ", "") + "**")
					})
					.catch(err => {
						message.reply(replies.error + err + "```")
						console.log(chalk.red(`[error] ${err}`))
					})
			})
		} else {
			database.ref(`/store/${message.guild.id}`).once("value").then(data => {
				const store = data.val()
				const items = store.items
				const price = store.price

				if (args[1] > items.length || args[1] < 0) return message.reply(replies.range + items.length)

				const deleted = items[args[1] - 1]

				items.splice(args[1] - 1, 1)
				price.splice(args[1] - 1, 1)

				database.ref(`/store/${message.guild.id}`).set({
						items: items,
						price: price
					})
					.then(() => {
						message.reply(replies.deleted + deleted + "**")
					})
					.catch(err => {
						message.reply(replies.error + err + "```")
						console.log(chalk.red(`[error] ${err}`))
					})
			})
		}
	} else if (args[0] == "edit") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(replies.permission_error)

		database.ref(`/store/${message.guild.id}`).once("value").then(data => {

			if (!data.val()) return message.reply(replies.no_store)
			const item = args[1] - 1
			const newName = args.join(" ").slice(6 + args[1].length).split(" | ")[0]
			const newPrice = args.join(" ").slice(6 + args[1].length).split(" | ")[1]
			
			const store = data.val()
			let items = store.items
			let price = store.price

			if(!item || item < 0 || item > items.length -1) return message.reply(replies.no_item + " 1 - " + items.length)
			if(isNaN(newPrice)) return message.reply(replies.price_NaN)
			
			items[item] = newName
			price[item] = newPrice

			database.ref(`/store/${message.guild.id}`).set({
				items: items,
				price: price
			}).then(() => {
				message.reply(replies.success_edit)
			}).catch(err => {
				console.log(chalk.red(`[error] ${err}`))
			})

		})
	}
}

module.exports.help = {
	name: "store",
	category: "economy"
}

module.exports.aliases = ["store", "sklep", "sklepik"]