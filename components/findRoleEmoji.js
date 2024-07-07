module.exports = ({client, roleId, useEmpty}) => {
	const emojiGuild = client.guilds.cache.get("1259516467721011250");
	const existingEmoji = emojiGuild.emojis.cache.find((emoji) => emoji.name == roleId);
	emoji = "";
	if (existingEmoji) emoji = `<:${roleId}:${existingEmoji.id}>`;
	else if (useEmpty) emoji = `<:NoEmoji:1259568746394288208>`;

	return emoji;
};
