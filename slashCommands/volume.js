const {
    MessageEmbed,
    MessabeButton,
    MessageActionRow
} = require("discord.js")
const { color, wrongcolor } = require("../botconfig/embed.json")

module.exports = {
    name: `volume`,
    description: "Set A Volume For The Player.",
    options: [
        {"Integer": { name: `volume`, description: `Specify The Volume You Want To Set in %.`, required: true }}
    ],
    run: async (client, interaction) => {
        const { options } = interaction;
        let volume = options.getInteger("volume");
        if(volume > 100) {
            return interaction.reply({ ephemeral: true, content: `Volume Cannot Be Higher Than 100.` })
        }
        if(volume < 0) {
            return interaction.reply({ ephemeral: true, content: `Volume Cannot Be Lower Than 0.` })
        }
        let queue = client.distube.getQueue(interaction.guild.id);
        if(!queue) {
            return interaction.reply({ ephemeral: true, content: `There Is No Song Playing.` })
        }
        if(queue.volume == 100) {
            return interaction.reply({ ephemeral: true, content: `The Volume Is Already At 100%.` })
        }
        let number = options.getInteger("volume")
        
        if(queue.volume + volume > 100) {
            queue.volume = 100;
        } else {
            queue.volume = number;
        }
        interaction.reply({ ephemeral: true, content: `Volume Set To ${volume}%.` })
    }
}