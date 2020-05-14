const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {

    const enemy = message.mentions.members.first()
    if (!enemy) return message.reply("oznacz przeciwnika")

    var {
        createCanvas,
        loadImage
    } = require('canvas')


    var canvas = createCanvas(1080, 1080)
    var ctx = canvas.getContext('2d')

    const field = await loadImage("./photos/checkers/plansza.png")
    const red = await loadImage("./photos/checkers/czerwony.png")
    const white = await loadImage("./photos/checkers/bialy.png")

    ctx.drawImage(field, 0, 0, 1080, 1080)

    ctx.font = `100px "Autour One"`
    ctx.fillStyle = "#ffb200";
    ctx.textAlign = "center";

    let startPositionRed = [135, 135]

    let positions = {
        red: [],
        white: []
    }

    for (var i = 0; i <= 4; i++) {
        ctx.drawImage(red, startPositionRed[0], startPositionRed[1], 135, 135)

        ctx.fillText(i + 1, startPositionRed[0] + 70, startPositionRed[1] + 100)

        positions.red[i] = {
            exist: true,
            position: [startPositionRed[0], startPositionRed[1]]
        }

        startPositionRed[0] += 270
    }

    startPositionRed = [0, 0]

    for (var i = 0; i <= 4; i++) {
        let number = i + 4
        ctx.drawImage(red, startPositionRed[0], startPositionRed[1], 135, 135)

        ctx.fillText(i + 5, startPositionRed[0] + 70, startPositionRed[1] + 100)

        positions.red[number] = {
            exist: true,
            position: [startPositionRed[0], startPositionRed[1]]
        }

        startPositionRed[0] += 270
    }
    // BIAŁY    
    let startPositionWhite = [0, 810]

    for (var i = 0; i <= 4; i++) {
        ctx.drawImage(white, startPositionWhite[0], startPositionWhite[1], 135, 135)
        ctx.fillText(i + 1, startPositionWhite[0] + 70, startPositionWhite[1] + 100)

        positions.white[i] = {
            exist: true,
            position: [startPositionWhite[0], startPositionWhite[1]]
        }

        startPositionWhite[0] += 270
    }

    startPositionWhite = [135, 945]

    for (var i = 0; i <= 4; i++) {
        let number = i + 4

        ctx.drawImage(white, startPositionWhite[0], startPositionWhite[1], 135, 135)
        ctx.fillText(i + 5, startPositionWhite[0] + 70, startPositionWhite[1] + 100)

        positions.white[number] = {
            exist: true,
            position: [startPositionWhite[0], startPositionWhite[1]]
        }

        startPositionWhite[0] += 270
    }

    const attachment = new Discord.Attachment(canvas.toBuffer(), "plansza.png")

    message.channel.send(attachment)

    const filter = msg => msg.author.id == message.author.id || msg.author.id == enemy.user.id
    const collector = new Discord.MessageCollector(message.channel, filter)

    function checkForWin() {
        console.log(chalk.blue("[function] [checkForWin] executed"))
        let status = false
        let existintg = 0

        for (var i = 0; i <= 7; i++) { // Białe
            if (positions["white"][i].exist) existintg += 1
        }
        for (var i = 0; i <= 7; i++) { // Czerwone
            if (positions["white"][i].exist) existintg += 1
        }

        if (existintg <= 3) status = true

        return status

    }

    function even(int) {
        console.log(chalk.blue("[function] [even] executed"))
        var res = int % 2
        if (res == 0) return true;
        else return false;
    }

    function checkForCollision(position, color, pawn) {
        console.log(chalk.blue("[function] [checkForCollision] executed"))
        let status = true
        for (var i = 0; i <= positions[color].length - 1; i++) {
            if (positions[color][i].position[0] == position[0] && positions[color][i].position[1] == position[1]) {

                console.log(positions[color][i].position[0] + " : " + position[0])
                console.log(positions[color][i].position[1] + " : " + position[1])
                console.log(i)
                console.log(color)
                status = false

            }
        }
        return status
    }

    function fight(nextX, nextY, color) {
        console.log(chalk.blue("[function] [fight] executed"))
        let status = false
        let pawn = 0;

        for (var i = 0; i <= positions[color].length - 1; i++) {
            if (positions[color][i].position[0] == nextX && positions[color][i].position[1] == nextY) {
                status = true
                pawn = i
            }
        }

        return [status, pawn]
    }

    function fightMove(positionAttack, direction) {
        console.log(chalk.blue("[function] [fightMove] executed"))
        let status = true

        if (direction == "left_up") {
            positionAttack[0] -= 270
            positionAttack[1] -= 270
        } else if (direction == "right_up") {
            positionAttack[0] += 270
            positionAttack[1] -= 270
        } else if (direction == "left_down") {
            positionAttack[0] -= 270
            positionAttack[1] += 270
        } else if (direction == "right_down") {
            positionAttack[0] += 270
            positionAttack[1] += 270
        }
        for (var i = 0; i <= positions["red"].length - 1; i++) {
            if (positions["red"][i].position[0] == positionAttack[0] && positions["red"][i].position[1] == positionAttack[1]) {
                status = false
            }
            if (positions["white"][i].position[0] == positionAttack[0] && positions["white"][i].position[1] == positionAttack[1]) {
                status = false
            }
        }
        return status
    }

    function move(direction, color, pawn) {
        console.log(chalk.blue("[function] [move] executed"))
        let status = true
        let place = "000"

        if (!positions[color][pawn - 1].exist) return [false, -1]

        if (color == "white") {
            if (direction == "left") {

                const x = positions[color][pawn - 1].position[0]
                const y = positions[color][pawn - 1].position[1]

                if (x <= 0 || y <= 0) {
                    return [false, 1]
                }
                const acceptMove = checkForCollision([x - 135, y - 135], "white", pawn)
                if (!acceptMove) {
                    return [false, 2]
                }
                const checkForFight = fight(x - 135, y - 135, "red")
                const moveStatus = fightMove([positions["white"][pawn - 1][0], positions["white"][pawn - 1][1]], "left_up")

                if (checkForFight) {
                    if (moveStatus && acceptMove) {
                        positions[color][pawn - 1].position[0] -= 135
                        positions[color][pawn - 1].position[1] -= 135
                    }
                } else {
                    if (acceptMove) {
                        positions[color][pawn - 1].position[0] -= 135
                        positions[color][pawn - 1].position[1] -= 135
                    }
                }

                if (checkForFight[0]) {
                    if (!moveStatus) {
                        return [false, 0]
                    } else {
                        positions[color][pawn - 1].position[0]


                        positions[color][pawn - 1].position[0] -= 135
                        positions[color][pawn - 1].position[1] -= 135

                        positions["red"][checkForFight[1]].exist = false
                    }
                }


            } else if (direction == "right") {
                const x = positions[color][pawn - 1].position[0]
                const y = positions[color][pawn - 1].position[1]

                if (x >= 945 || y <= 0) {
                    console.log(`X: ${x} Y: ${y}`)
                    console.log(`X: ${x >= 945} Y: ${y <= 0}`)
                    return [false, 4]
                }
                const acceptMove = checkForCollision([x + 135, y - 135], "white", pawn)
                if (!acceptMove) {
                    return [false, 5]
                    console.log("acceptMove - in fight")
                }

                const checkForFight = fight(x + 135, y - 135, "red")

                positions[color][pawn - 1].position[0] += 135
                positions[color][pawn - 1].position[1] -= 135

                if (checkForFight[0]) {
                    const moveStatus = fightMove([positions["white"][pawn - 1][0], positions["white"][pawn - 1][1]], "right_up")
                    if (!moveStatus) {
                        return [false, 0]
                    } else {
                        positions[color][pawn - 1].position[0]


                        positions[color][pawn - 1].position[0] += 135
                        positions[color][pawn - 1].position[1] -= 135

                        positions["red"][checkForFight[1]].exist = false
                    }
                }


            }
        }
        if (color == "red") {
            if (direction == "left") {
                const x = positions[color][pawn - 1].position[0]
                const y = positions[color][pawn - 1].position[1]

                if (x <= 0 || y == 1080) {
                    return [false, 7]
                }

                const acceptMove = checkForCollision([x - 135, y + 135], "red", pawn)
                if (!acceptMove) {
                    return [false, 8]
                }
                const checkForFight = fight(x - 135, y + 135, "white", pawn)

                positions[color][pawn - 1].position[0] -= 135
                positions[color][pawn - 1].position[1] += 135

                if (checkForFight[0]) {
                    const moveStatus = fightMove([positions["red"][pawn - 1][0], positions["red"][pawn - 1][1]], "left_down")
                    if (!moveStatus) {
                        return [false, 0]
                    } else {
                        positions[color][pawn - 1].position[0]


                        positions[color][pawn - 1].position[0] -= 135
                        positions[color][pawn - 1].position[1] += 135

                        positions["white"][checkForFight[1]].exist = false
                    }
                }


            } else if (direction == "right") {
                const x = positions[color][pawn - 1].position[0]
                const y = positions[color][pawn - 1].position[1]

                if (x >= 945 || y >= 1080) {
                    console.log(`"X": ${x !== 945} Y: ${y <= 0}`)
                    return [false, 10]
                }

                const acceptMove = checkForCollision([x + 135, y + 135], "red", pawn)
                if (!acceptMove) {
                    return [false, 11]
                }

                positions[color][pawn - 1].position[0] += 135
                positions[color][pawn - 1].position[1] += 135

                const checkForFight = fight(x + 135, y + 135, "white")

                if (checkForFight[0]) {
                    const moveStatus = fightMove([positions["red"][pawn - 1][0], positions["red"][pawn - 1][1]], "right_down")
                    if (!moveStatus) {
                        return [false, 0]
                    } else {
                        positions[color][pawn - 1].position[0]


                        positions[color][pawn - 1].position[0] += 135
                        positions[color][pawn - 1].position[1] += 135

                        positions["white"][checkForFight[1]].exist = false
                    }
                }
            }
        }

        let conditional
        if (direction == "right" || direction == "left") conditional = true
        else conditional = false

        if (conditional == false) {

            return [false, 0]
        }

        return [status, place]
    }

    function draw() {
        console.log(chalk.blue("[function] [draw] executed"))

        //CZERWONE
        for (var i = 0; i <= 7; i++) {
            if (positions.red[i].exist) {
                ctx.drawImage(red, positions.red[i].position[0], positions.red[i].position[1], 135, 135)

                ctx.fillText(i + 1, positions.red[i].position[0] + 70, positions.red[i].position[1] + 100)

            }
        }
        //BIAŁE
        for (var i = 0; i <= 7; i++) {
            if (positions.white[i].exist) {
                ctx.drawImage(white, positions.white[i].position[0], positions.white[i].position[1], 135, 135)

                ctx.fillText(i + 1, positions.white[i].position[0] + 70, positions.white[i].position[1] + 100)
            }
        }
    }

    let tick = 0;

    collector.on("collect", msg => {
        const instructions = msg.content.split(" ")

        let color

        if (even(tick)) {
            color = "white"
            if (msg.author.id != message.author.id) return console.log("1")
        } else {
            color = "red"
            if (msg.author.id != enemy.user.id) return console.log("2")
        }

        if (isNaN(instructions[1])) {
            return console.log("3")
        }
        ctx.drawImage(field, 0, 0, 1080, 1080) //RESET

        const status = move(instructions[0], color, instructions[1])

        console.log(status)

        draw()

        console.log("RED:")
        console.log(positions["red"])
        console.log("WHITE:")
        console.log(positions["white"])

        if (!status[0]) {
            return msg.reply("nie możesz tego zrobić")
        }

        const attachment = new Discord.Attachment(canvas.toBuffer(), "plansza.png")

        message.channel.send(attachment).then(m => {
            m.react("❌")

            const reactionFilter = (r, user) => r.emoji.name == "❌" && user.id == message.author.id || user.id == enemy.user.id
            const reactionCollector = new Discord.ReactionCollector(reactionFilter)

            reactionCollector.on("collect", r => {
                reactionCollector.stop()
                collector.stop()

                message.channel.send("przerwano")
            })
        })
        if (checkForWin()) {
            collector.stop()
            message.channel.send(msg.author + " wygrałeś")
        }
        tick++
    })
}

module.exports.help = {
    name: "checkers"
    // category: "game"
}

module.exports.aliases = ["warcaby"]