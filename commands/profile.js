const Discord = require("discord.js")
const fs = require("fs")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
	const firebase = require("firebase")
	const database = firebase.database()
	database.ref(`/users/${message.guild.id}/${message.author.id}/mesagesCount`).once('value')
		.then(async messagesCount => {
			database.ref(`/users/${message.guild.id}/${message.author.id}/level`).once('value')
				.then(async level => {
					database.ref(`/economy/${message.guild.id}/${message.author.id}/bucks`).once("value")
						.then(async bucks => {
							const user = client.users.cache.get(message.author.id)
							const snekfetch = require("snekfetch")
							const GIFEncoder = require('gifencoder')
							const encoder = new GIFEncoder(1080, 720);
							const pngFileStream = require('png-file-stream');

							var {
								createCanvas,
								loadImage
							} = require('canvas')


							var canvas = createCanvas(1080, 720)
							var ctx = canvas.getContext('2d')

							const {
								body: buffer
							} = await snekfetch.get(user.displayAvatarURL().replace("webp", "png"));
							const avt = await loadImage(buffer);
							ctx.drawImage(avt, 62, 140, 230, 230);

							const bkg = await loadImage("./photos/profile_card.png");
							ctx.drawImage(bkg, 0, 0, 1080, 720)

							ctx.textAlign = "left";

							ctx.font = `70px "Comic Sans MS"`
							ctx.fillStyle = "#ffffff";
							let username = user.username
							if (username.length > 13) {
								username = username.substring(0, 10) + "..."
							}
							ctx.fillText(username, 73, 442)

							ctx.font = `70px "Autour One"`
							ctx.fillStyle = "#ffffff";
							ctx.textAlign = "left";
							const l = level.val() || 0
							ctx.fillText(l + " level", 68, 676)

							ctx.textAlign = "center";

							ctx.font = `70px "Autour One"`
							ctx.fillStyle = "#ffffff";
							ctx.fillText(bucks.val() || 0, 690, 275)

							ctx.font = `70px "Autour One"`
							ctx.fillStyle = "#ffffff";
							ctx.fillText(messagesCount.val() || 0, 809, 508)


							if (args[0]) {

								const writer = fs.createWriteStream(`gifs/${message.author.id}.gif`)

								encoder.createReadStream().pipe(writer)
								encoder.start();
								encoder.setRepeat(0);
								encoder.setDelay(10);
								encoder.setQuality(10);

								encoder.addFrame(ctx)
								ctx.globalCompositeOperation = 'difference';
								ctx.fillStyle = 'white';
								ctx.fillRect(0, 0, canvas.width, canvas.height);
								encoder.addFrame(ctx)
								encoder.finish();

								writer.on('finish', () => {
									message.channel.send({
										"files": [`gifs/${message.author.id}.gif`]
									})
								});

							} else {
								const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "profile.png")
								message.channel.send(attachment)
							}

						})
				})
		})
}
module.exports.help = {
	name: "profile",
	category: "info"
}
module.exports.aliases = ["profil"]