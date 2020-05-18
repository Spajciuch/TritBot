const Discord = require("discord.js")
const chalk = require("chalk")
const {
	database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
	let mm = message.mentions.members.first()

	if (!args[0] || mm) {
		if (!mm) {
			database().ref(`/economy/${message.guild.id}/${message.author.id}`).once("value").then(data => {
				const account = data.val()

				if (!account.bucks) return message.reply(lang.commands.credits.replies.no_account + " <:coin:565840795748401152>")

				message.reply(`${lang.commands.credits.replies.your_ballance} **${account.bucks}**<:coin:565840795748401152>`)
			})
		}
		if (mm) {
			database().ref(`/economy/${message.guild.id}/${mm.id}`).once("value").then(data => {
				const account = data.val()

				if (!account.bucks) return message.reply(lang.commands.credits.replies.no_account_M + " <:coin:565840795748401152>")

				message.reply(`${lang.commands.credits.replies.ballance} **${account.bucks}**<:coin:565840795748401152>`)
			})
		}
	} else if (args[0] == "transfer") {
		database().ref(`/economy/${message.guild.id}/${message.author.id}`).once("value").then(data => {
			if (!message.mentions.members.first()) return message.reply(lang.commands.credits.replies.no_member)

			const member = message.mentions.members.first()
			const account = data.val()

			if (!account.bucks) return message.reply(lang.commands.credits.replies.no_account + " <:coin:565840795748401152>")

			const authorCredits = account.bucks || 0
			const credits = args[2]

			if (!credits) return message.reply(lang.commands.credits.replies.no_credits)
			if (authorCredits < credits) return message.reply(lang.commands.credits.replies.tooMuch)

			database().ref(`/economy/${message.guild.id}/${member.user.id}`).once("value").then(mData => {
				database().ref(`/economy/${message.guild.id}/${member.user.id}/bucks`).once("value").then(b => {
					let memberAccount = mData.val()
					let memberCredits
					if (!b.val()) memberCredits = 0
					else memberCredits = b.val()

					if (!memberAccount) {
						let jsonString = `{"bucks":"0", "lastDaily": "0", "lastWork":"0", "inventory":[]}`
						let parsed = JSON.parse(jsonString)
						memberAccount = parsed
					}

					database().ref(`/economy/${message.guild.id}/${member.user.id}`).set({
						bucks: Number(memberCredits) + Number(credits),
						lastDaily: memberAccount.lastDaily || null,
						lastWork: memberAccount.lastWork || null,
						inventory: memberAccount.inventory || null
					})

					database().ref(`/economy/${message.guild.id}/${message.author.id}`).set({
							bucks: Number(authorCredits) - Number(credits),
							lastDaily: account.lastDaily || null,
							lastWork: account.lastWork || null,
							inventory: account.inventory || null
						})
						.then(() => {
							message.reply(lang.commands.credits.replies.success[0] + credits + lang.commands.credits.replies.success[1])
						})
						.catch(err => {
							console.log(chalk.red(`[error] ${err}`))
						})
				})
			})
		})
	} else if (args[0] == "add") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.credits.replies.permission_error)
		const member = message.mentions.members.first()

		if (!member) return message.reply(lang.commands.credits.replies.no_member)

		const credits = args[2]
		if (!credits) return message.reply(lang.commands.credits.replies.no_credits)

		database().ref(`/economy/${message.guild.id}/${member.user.id}`).once("value").then(data => {
			database().ref(`/economy/${message.guild.id}/${member.user.id}/bucks`).once("value").then(b => {
				let account = data.val()
				let currentCredits

				if (!b.val()) currentCredits = 0
				else currentCredits = b.val()

				if (!account) {
					let jsonString = `{"bucks":"0", "lastDaily": "0", "lastWork":"0", "inventory":[]}`
					let parsed = JSON.parse(jsonString)
					account = parsed
				}

				database().ref(`/economy/${message.guild.id}/${member.user.id}`).set({
						bucks: Number(currentCredits) + Number(credits),
						lastDaily: account.lastDaily || null,
						lastWork: account.lastWork || null,
						inventory: account.inventory || null
					})
					.then(() => {
						let reply = lang.commands.credits.replies.success_add
						message.reply(lang.commands.credits.replies.success_add[0] + " " + credits + " <:coin:565840795748401152> " + lang.commands.credits.replies.success_add[1] + " " + member)
					})
					.catch(err => {
						console.log(chalk.red(`[error] ${err}`))
					})
			})
		})
	} else if (args[0] == "remove") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.command[this.help.name].replies.permission_error)

		const member = message.mentions.members.first()
		if (!member) return message.reply(lang.commands[this.help.name].replies.no_member)

		let credits = args[2]
		if (!credits) return message.reply(lang.command[this.help.name].replies.no_credits)

		database().ref(`/economy/${message.guild.id}/${member.user.id}`).once("value").then(data => {
			let account = data.val()

			if (!account) {
				let jsonString = `{"bucks":"0", "lastDaily": "0", "lastWork":"0", "inventory":[]}`
				let parsed = JSON.parse(jsonString)
				account = parsed
			}

			if (isNaN(credits) && credits !== "all") return message.reply(lang.commands[this.help.name].replies.no_credits)
			if (credits == "all") credits = account.bucks

			database().ref(`/economy/${message.guild.id}/${member.user.id}`).set({
				bucks: Number(Number(account.bucks) - Number(credits)),
				lastDaily: account.lastDaily || null,
				lastWork: account.lastWork || null,
				inventory: account.inventory || null
			}).then(() => {
				message.reply(lang.commands[this.help.name].replies.success_operation)
			}).catch(() => {
				message.reply(lang.commands[this.help.name].replies.erorr)
			})
		})
	} else if (args[0] == "set") {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.command[this.help.name].replies.permission_error)

		const member = message.mentions.members.first()
		if (!member) return message.reply(lang.commands[this.help.name].replies.no_member)

		let credits = args[2]
		if (!credits) return message.reply(lang.command[this.help.name].replies.no_credits)

		database().ref(`/economy/${message.guild.id}/${member.user.id}`).once("value").then(data => {
			let account = data.val()

			if (!account) {
				let jsonString = `{"bucks":"0", "lastDaily": "0", "lastWork":"0", "inventory":[]}`
				let parsed = JSON.parse(jsonString)
				account = parsed
			}

			database().ref(`/economy/${message.guild.id}/${member.user.id}`).set({
				bucks: Number(credits),
				lastDaily: account.lastDaily || null,
				lastWork: account.lastWork || null,
				inventory: account.inventory || null
			}).then(() => {
				message.reply(lang.commands[this.help.name].replies.success_operation)
			}).catch(() => {
				message.reply(lang.commands[this.help.name].replies.erorr)
			})

		})
	}
}

module.exports.help = {
	name: "credits",
	category: "economy"
}