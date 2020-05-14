const Discord = require("discord.js")
const {
    database
} = require("firebase")

module.exports.run = async (client, message) => {
    database().ref(`/repsonses/${message.guild.id}/status`).once("value").then(d => {
        if (d.val() == false) return;
        const reactions = require("../config/reactions.json")
        const hello = reactions.hello
        const goodNight = reactions.goodNight
        const dinner = reactions.dinner
        const goAway = reactions.goAway
        const uwu = reactions.uwu
        var chance = Math.floor(Math.random() * 8 - 0) + 0
        if (message.content.toLowerCase().includes("wita")) {

            if (chance !== 2) return
            var choose = hello[Math.floor(Math.random() * hello.length - 0) + 0]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("hej")) {

            if (chance !== 2) return
            var choose = hello[Math.floor(Math.random() * hello.length - 0) + 0]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("dobranoc")) {

            if (chance !== 2) return
            var choose = goodNight[Math.floor(Math.random() * goodNight.length - 0) + 0]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("smacznego")) {

            if (chance !== 2) return
            var choose = dinner[Math.floor(Math.random() * dinner.length - 0) + 0]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("ide")) {


            if (chance !== 2) return
            var choose = goAway[Math.floor(Math.random() * goAway.length - 0) + 0]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("idę")) {

            if (chance !== 2) return
            var choose = goAway[Math.floor(Math.random() * goAway.length - 0) + 0]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("uwu") || message.content.toLowerCase().includes("owo")) {
            if (chance !== 2) return
            const choose = uwu[Math.floor(Math.random() * uwu.length)]
            message.channel.send(choose)
        }
        if (message.content.toLowerCase().includes("@someone")) {

            const asciiFaces = ["̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\З= ( ▀ ͜͞ʖ▀) =Ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿   ", "ʕ•ᴥ•ʔ", "༼ つ ◕_◕ ༽つ", "(◕‿◕✿)", "༼ つ ͡° ͜ʖ ͡° ༽つ", "(╯°□°）╯︵ ┻━┻"]
            let members = []
            let i = 0
            message.guild.members.cache.forEach(member => {
                members[i] = member.user.id
                i++
            });
            message.channel.send("<@" + members[Math.floor(Math.random() * members.length)] + "> " + asciiFaces[Math.floor(Math.random() * asciiFaces.length)])
        }
        if (message.content.toLowerCase().includes("xd")) {

            var chanceXD = Math.floor(Math.random() * 100 - 0) + 0
            if (chanceXD !== 2) return
            var choose = "xD"
            message.channel.send(choose)
        }
    })
}