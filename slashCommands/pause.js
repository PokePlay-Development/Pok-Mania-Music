const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require("discord.js");
const { color, wrongcolor } = require("../botconfig/embed.json");

module.exports = {
    name: "pause",
    description: "Pause the current song",
    run: async (client, interaction) => {
        let queue = client.distube.getQueue(interaction.guild.id);
        if(!queue) {
            return interaction.reply({ ephemeral: true, content: `There Is No Song Playing.` })
        }
        if(!interaction.member.voice.channel) {
            return interaction.reply({ ephemeral: true, content: `You Must Be In A Voice Channel To Use This Command.` })
        }
        if(interaction.member.voice.channel.id != interaction.guild.me.voice.channel.id) {
            return interaction.reply({ ephemeral: true, content: `You Must Be In The Same Voice Channel As The Player To Use This Command.` })
        }
        if(!queue.songs.length) {
            return interaction.reply({ ephemeral: true, content: `There Is No Song In The Queue.` })
        }
        if(!queue.connection) {
            return interaction.reply({ ephemeral: true, content: `There Is No Connection To The Voice Channel.` })
        }
        if(!queue.connection.dispatcher) {
            return interaction.reply({ ephemeral: true, content: `There Is No Song Playing.` })
        }
        if(queue.connection.dispatcher.paused) {
            return interaction.reply({ ephemeral: true, content: `The Song Is Already Paused.` })
        }
        queue.pause()
        interaction.reply({ ephemeral: true, content: `Song Paused.` })
    }
}