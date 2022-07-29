const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require("discord.js");
const { color, wrongcolor } = require("../botconfig/embed.json");

module.exports = {
    name: "play",
    description: "Play a song from youtube/soundcloud/spotify",
    options: [
        {
			"String": {
				name: "song",
				description: "Which Song do you want to play",
				required: true
			}
		}
    ],
    run: async (client, interaction) => {
        const { options } = interaction;
        let query = options.getString("Query");
        const Text = options.getString("song");
        if(!interaction.member.voice.channel) {
            return interaction.reply({ ephemeral: true, content: `Please Join A Voice Channel Before Running This Command.` })
        }
        if(interaction.member.voice.channel.userLimit != 0 && interaction.member.voice.channel.full) {
            return interaction.reply({ ephemeral: true, content: `This Channel Is Full.` })
        }
        if(interaction.member.voice.channel.guild.me.voice.channel && interaction.member.voice.channel.guild.me.voice.channel.id != interaction.member.voice.channel.id) {
            return interaction.reply({ ephemeral: true, content: `I'm Already In A Voice Channel.` })
        }
        await interaction.reply({
            content: `<a:searching:1002545483283185776> Searching For ${Text}...`,
        })
        try {
            let channel = interaction.member.voice.channel;
            let queue = client.distube.getQueue(interaction.guild.id);
            await client.distube.play(channel, Text, {
                member: interaction.member,
                textChannel: interaction.channel
            })
        } catch (e) {
            return interaction.reply({ ephemeral: true, content: `An Error Has Occured.` })
        }
    }
}