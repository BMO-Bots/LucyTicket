const { CommandInteraction, MessageEmbed } = require("discord.js");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
  name: "remove",
  description: "Butta fuori un utente da un ticket.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "user",
      description: "L'utente interessato.",
      type: "USER",
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
    if (!ticketData.usersInTicket.includes(user.id)) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Sistema Ticket \❌")
            .setDescription(client.languages.__mf("commands.remove.user_not_in_ticket", {
              user_mention: `<@${user.id}>`,
              user_tag: user.tag
            }))
            .setColor("RED")
        ], ephemeral: true
      });
    }

    try {
      await interaction.channel.permissionOverwrites.delete(user.id);
    } catch {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Sistema Ticket \❌")
            .setDescription("Non riesco a rimuovere questo utente dal ticket." + "```" + error + "```")
            .setColor("RED")
        ], ephemeral: true
      });
    }

    ticketData.usersInTicket.splice(ticketData.usersInTicket.indexOf(user.id), 1);
    await ticketData.save();

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Sistema Ticket \✅")
          .setDescription(client.languages.__mf("commands.remove.user_removed", {
            user_mention: `<@${user.id}>`,
            user_tag: user.tag
          }))
          .setColor("GREEN")
      ]
    });
  },
};