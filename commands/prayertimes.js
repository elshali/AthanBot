const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { RapidAPIkey } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prayertimes')
        .setDescription('Lists prayer times for your region.')
        .addStringOption((option) => option.setName('city').setDescription('Your city').setRequired(true))
        .addStringOption((option) => option.setName('country').setDescription('Your country').setRequired(true)),
    async execute(interaction) {
        
        const city = await interaction.options.get('city');
        const country = await interaction.options.get('country');

        const result = {
            method: 'GET',
            url: 'https://aladhan.p.rapidapi.com/timingsByCity',
            params: {country: country.value, city: city.value},
            headers: {
              'X-RapidAPI-Key': RapidAPIkey,
              'X-RapidAPI-Host': 'aladhan.p.rapidapi.com'
            }
          };

        axios.request(result).then(function (response) {

            let res = response.data.data.timings

            Object.entries(res).forEach((entry) => {
                const [key, value] = entry;
                //DO STUFF HERE 
            });

            const Embed = new EmbedBuilder()
                .setTitle(`Prayer times for ${city.value}, ${country.value}`)
                .setAuthor({name: 'AthanBot'})
                .addFields(
                    { name: 'Fajr', value: `${JSON.stringify(res.Fajr).replace(/"/g, '')}`},
                    { name: 'Dhuhr', value: `${JSON.stringify(res.Dhuhr).replace(/"/g, '')}`},
                    { name: 'Asr', value: `${JSON.stringify(res.Asr).replace(/"/g, '')}`},
                    { name: 'Maghrib', value: `${JSON.stringify(res.Maghrib).replace(/"/g, '')}`},
                    { name: 'Isha', value: `${JSON.stringify(res.Isha).replace(/"/g, '')}`},
                );

            interaction.reply({ embeds: [Embed]});
            //interaction.reply(`Prayer times... ${JSON.stringify(response.data.data.timings)}`)
        }).catch(function (error) {
            console.error(error);
        });
    },
};