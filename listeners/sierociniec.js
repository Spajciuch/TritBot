    const roles = [
        "Sierotka", //0
        "Aktywna sierotka", //1
        "Dobra sierotka", //2
        "Lubiana sierotka", //3
        "Kochana sierotka", //4
        "Sławna sierotka", //5
        "Starszak", //6
        "Kochane starszaki", //7
        "UwU starszaki" //8
    ]

    module.exports.run = async client => {
        const {
            database
        } = require("firebase")

        client.on("message", message => {
            if (message.channel.type == "dm") return
            if (message.guild.id !== "615317472781926403") return;
            database().ref(`/users/${message.guild.id}/${message.author.id}`).once("value").then(data => {
                if (!data.val()) return;
                const account = data.val()
                const xp = account.mesagesCount

                if (xp <= 4000) {
                    const i = Math.round(xp / 1000)
                    const role = message.guild.roles.cache.find(r => r.name == roles[i])
                    if (!role) return

                    if (message.member.roles.has(role)) return console.log("return 1")
                    else {
                        message.member.roles.add(role)
                    }
                } else { //6000 8000 10000 1200
                    let i
                    let role
                    if (xp > 5000) { //5
                        i = 5
                        role = message.guild.roles.cache.find(r => r.name == roles[i])
                    }
                    if (xp > 8000) { //6
                        i = 6
                        role = message.guild.roles.cache.find(r => r.name == roles[i])
                    }
                    if (xp > 10000) { //7
                        i = 7
                        role = message.guild.roles.cache.find(r => r.name == roles[i])
                    }
                    if (xp > 12000) { //8
                        i = 8
                        role = message.guild.roles.cache.find(r => r.name == roles[i])
                    }

                    if (!role) return //console.log("nie ma roli bo coś")

                    if (message.member.roles.has(role)) return //console.log("return 1")
                    else {
                        message.member.roles.add(role)

                    }


                }

            })
        })
        client.on("guildMemberAdd", member => {
            if (member.guild.id !== "615317472781926403") return;

            const rolesIds = ["629397623782113295", "629397744372678658", "629397872928096266", "629397800592998400"]

            for (var i = 0; i <= rolesIds.length - 1; i++) {
                const role = member.guild.roles.find(r => r.id == rolesIds[i])

                member.roles.add(role)
            }
        })
    }