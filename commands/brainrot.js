const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("brainrot")
		.setDescription("Say stuff")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("(Optional) Specialised Brainrot")
				.setRequired(false)
				.addChoices(
					{name: "Wisdom", value: "wisdom", description: "Tells you goated wisdom."},
					{name: "Maxxing", value: "maxxing", description: "Bro's wordmaxxing."}
				)
		),
	execute: async ({client, interaction}) => {
		brainrot = [
			"skibidi",
			"sigma",
			"rizz",
			"aura",
			"gyatt",
			"fanum",
			"tax",
			"rizzler",
			"looksmaxxing",
			"baby gronk",
			"dj khaled",
			"grimace",
			"opium bird",
			"gooning",
			"gooner",
			"fortnite",
			"john pork",
			"backrooms",
			"livvy dunne",
			"pomni",
			"L",
			"W",
			"sus",
			"amogus",
			"edge",
			"ohio",
			"alpha",
			"skibidi toilet",
			"beta",
			"mew",
			"streak",
			"mewing",
			"poggers",
			"peter griffin",
			"bussin",
			"goofy aah",
			"on god",
			"chungus",
			"gigachad",
			"delulu",
			"based",
			"cringe",
			"freddy fazbear",
			"tiktok",
			"goated",
			"jelq",
			"molly",
			"gay",
			"smurf",
			"grindset",
			"andrew tate",
			"omega",
			"male",
			"funny moments",
			"mrbeast",
			"da baby",
		];

		message = "";

		switch (interaction.options.getString("type")) {
			case "maxxing":
				if (Math.round(Math.random()) == 1) {
					message = "Bro's ";
				}
				message += brainrot[Math.floor(Math.random() * brainrot.length)] + "maxxing";
				break;
			default:
				x = Math.floor(Math.random() * 10 + 0) + 2;
				messageLength = Math.ceil((1 / 100) * Math.pow(x, 3) + 1);
				messageLength = Math.max(1, messageLength);
				for (let i = 0; i < messageLength; i++) {
					message += brainrot[Math.floor(Math.random() * brainrot.length)] + " ";
				}
		}

		await interaction.reply({content: message});
	},
};
