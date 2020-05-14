const {
    database
} = require("firebase")
const warnModule = require("../listeners/warns.js")

module.exports.run = async (message, client) => {
    database().ref(`anti-raid/${message.guild.id}`).once("value").then(d => {
        const data = d.val()
        if (!d.val()) return;

        const enabled = data.enabled
        if (!enabled) return;
        const channels = data.channels
        // console.log(channels)
        if (channels.includes(message.channel.id)) return;
        const modules = data.modules

        //Wykrywanie zaproszenia do discorda

        if (data.modules.inviteModule.enabled) {
            if (message.content.toLowerCase().includes("https://discord.gg/")) {
                database().ref(`/warns/${message.guild.id}/${message.author.id}`).once("value").then(w => {
                    warnsData = w.val()

                    let warns = []
                    let byList = []

                    if (w.val()) {
                        warns = warnsData.reasons
                        byList = warnsData.byList
                    }

                    warns[warns.length] = "TRIT - ANTIRAID"
                    byList[byList.length] = client.user.tag

                    message.delete() // Usunięcie wiadomości

                    database().ref(`/warns/${message.guild.id}/${message.author.id}`).set({
                        reasons: warns,
                        byList: byList
                    }).then(() => {
                        warnModule.run(message.guild.id, message.author.id, message.channel.id, client)
                    })
                    //Wgranie danych do database'a
                })
            }
        }

        // Wykrywanie kilku takich samych wiadomości

        if (data.modules.messageModule.enabled) {
            if (message.member.hasPermission("MANAGE_MESSAGES")) return;

            database().ref(`lastMessage/${message.guild.id}/${message.author.id}/lastMessage`).once("value").then(mContent => {
                database().ref(`lastMessage/${message.guild.id}/${message.author.id}/counter`).once("value").then(mCounter => {

                    let lastMessage = mContent.val()
                    let counter = mCounter.val() || 1

                    if (!lastMessage || lastMessage == null) {
                        database().ref(`lastMessage/${message.guild.id}/${message.author.id}`).set({
                            lastMessage: message.content,
                            counter: 1
                        })
                        return;
                    }

                    if (lastMessage == message.content) {
                        counter++

                        if (counter >= 5) { //Pięć takich samych wiadomości pod rząd
                            message.delete()

                            database().ref(`lastMessage/${message.guild.id}/${message.author.id}`).set({
                                lastMessage: message.content,
                                counter: counter
                            })
                        }
                        if (counter >= 10) { //Dziesięć takich samych wiadomości
                            database().ref(`/warns/${message.guild.id}/${message.author.id}`).once("value").then(w => {
                                let warnsData = w.val()

                                let warns = []
                                let byList = []

                                if (w.val()) {
                                    warns = warnsData.reasons
                                    byList = warnsData.byList
                                }

                                warns[warns.length] = "TRIT - ANTIRAID"
                                byList[byList.length] = client.user.tag

                                message.delete() // Usunięcie wiadomości

                                database().ref(`/warns/${message.guild.id}/${message.author.id}`).set({
                                        reasons: warns,
                                        byList: byList
                                    })
                                    .then(() => {
                                        message.channel.send("everything done")

                                        warnModule.run(message.guild.id, message.author.id, message.channel.id, client)
                                    })
                            })
                        }
                        database().ref(`lastMessage/${message.guild.id}/${message.author.id}`).set({
                            lastMessage: message.content,
                            counter: counter
                        })
                    } else {
                        database().ref(`lastMessage/${message.guild.id}/${message.author.id}`).set({
                            lastMessage: message.content,
                            counter: 1
                        })
                    }
                })
            })
        }
    })
}