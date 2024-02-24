const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
  name: "giveto",
  description: "Dai il ticket in gestione a un altro staffer.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'user',
      description: 'Lo staffer interessato.',
      type: 'USER',
      required: true
    }
  ],
  /**
   *
   * @param {import("../..").Bot} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const user = interaction.options.getUser('user');
    const ticketData = await isTicket(interaction);
    if (!ticketData) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Sistema Ticket \❌")
            .setDescription(client.languages.__("errors.channel_without_ticket"))
            .setColor("RED")
        ], ephemeral: true
      });
    }

    if (!ticketData.isClaimed) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Sistema Ticket \❌")
            .setDescription(client.languages.__("commands.giveto.ticket_not_claimed"))
            .setColor("RED")
        ], ephemeral: true
      });
    }

    if (ticketData.staffClaimed !== interaction.user.id) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Sistema Ticket \❌")
            .setDescription(client.languages.__("commands.giveto.ticket_not_claimed_by_you"))
            .setColor("RED")
        ], ephemeral: true
      });
    }

    interaction.channel.permissionOverwrites.edit(user.id, {
      VIEW_CHANNEL: true,
      MANAGE_CHANNELS: true,
    });

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Sistema Ticket \✅")
          .setDescription(client.languages.__mf("commands.giveto.ticket_given_to", {
            user_mention: `<@${user.id}>`,
            author_mention: `<@${interaction.user.id}>`
          }))
          .setColor("GREEN")
      ]
    })
  },
};