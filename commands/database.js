const Discord = require("discord.js")
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const uri = `mongodb+srv://trit:${process.env.PASSWORD}@cluster0-0qytd.gcp.mongodb.net/test?retryWrites=true&w=majority`
module.exports.run = async (client, message, args, embed_color, lang) => {
    message.channel.send("✔ Command works")
    const dbName = 'myproject';
    MongoClient.connect(uri, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db("trit");

        const insertDocuments = function (db, callback) {
            // Get the documents collection
            const collection = db.collection('Cluster0');
            const id = message.guild.id
            collection.insertMany([{
                id: {
                    "prefix": "!",
                    "language": "pl"
                }
            }], function (err, result) {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                assert.equal(3, result.ops.length);
                console.log("Inserted 3 documents into the collection");
                callback(result);
            });
        }
        insertDocuments()

        client.close();
    });
}

module.exports.help = {
    name: "database"
}
module.exports.aliases = ["db"]
//`mongodb+srv://trit:${process.env.PASSWORD}@cluster0-0qytd.gcp.mongodb.net/test?retryWrites=true&w=majority`