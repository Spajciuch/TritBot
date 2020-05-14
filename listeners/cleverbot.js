const Cleverbot = require('cleverbot');
let clev = new Cleverbot({
  key: 'CC82etkBY1Wd4bfM2BOrWs6KVCA'
});
module.exports.run = async(client) => {
client.on("message", async message => {
    if(message.channel.name !== "cleverbot") return
    if(message.author.bot) return 
    clev.query(message.content.replace("ę", "e").replace("ó", "o").replace("ą", "a").replace("ś", "s").replace("ł", "l").replace("ż", "z").replace("ź", "z").replace("ć", "c").replace("ń", "n"))
        .then(function (response) {
            message.channel.send(response.output || "Error").catch()
    });
})
}