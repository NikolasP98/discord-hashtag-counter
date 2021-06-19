// 4. ===== GLOBAL FUNCTIONS =====

// (STRING || FALSE BOOL) PARSE A MENTIONED USER OR ROLE BY REMOVING TOKENS
export const parseMention = (mention) => {
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!') || mention.startsWith('&')) {
			mention = mention.slice(1);
		}

		return mention;
	}
	return false;
};

// (STRING || FALSE BOOL) VALIDATE IF MESSAGE IS A VALID TOPIC
export const validateMsg = (message) => {
	// Gather all topics into single array
	const titles = Object.keys(topics).map((topic) => topic.toUpperCase());

	// check if messagee contains hashtag (#) (returns false if none are detected)
	if (!message.includes('#')) return false;

	// extract string directly after first hashtag (#)
	const topic = message.split('#')[1].split(' ')[0].toUpperCase();

	// validate if extracted hashtag can be found in titles (topics) array created earlier
	if (!titles.includes(topic)) return false;

	// if valid, return said topic as string
	console.log(`topic "${topic}" is a valid entry`);
	return topic;
};

// (BOOL) VALIDATE IF TOPIC IS VALID (is it necessary???)
export const validateTopic = (topic) => {
	const mainTopics = Object.keys(topics).map((topic) => topic.toUpperCase());

	// if (!(topic = validateMsg(topic))) return;
	if (mainTopics.includes(topic.toUpperCase())) return true;
	return false;
};

// (UNDEFINED) UPDATE ROLES LIST
export const updateRoles = (e) => {
	// First validate changes on roles
	const allRoles = Object.keys(roles).sort().join(',');

	console.log(`all roles (DB): ${allRoles}`);

	const currRoles = e.guild.roles.cache
		.map((role) => {
			return role.id;
		})
		.sort()
		.join(',');

	console.log(`current roles: ${currRoles}`);

	console.log(`allRoles == currRoles? =>  ${allRoles == currRoles}`);

	if (allRoles == currRoles) return;

	// If update detected, update main database
	roles = {};

	e.guild.roles.cache.each((role) => {
		return (roles[role.id] = {
			id: role.id,
			name: role.name.toUpperCase(),
			data: role,
		});
	});

	console.log(`le roles: ${JSON.stringify(roles)}`);
};

// (ROLE || FALSE BOOL) VALIDATE ROLE EXISTENCE IN CURRENT LIST OF ROLES
export const searchRole = (role) => {
	for (const key in roles) {
		if (roles[key].id == role) {
			console.log(`THE ROLE IS: ${roles[key].name}`);
			return roles[key];
		}
	}
	return false;
};

// (VOID FUNCTION || FALSE BOOL) VALIDATE HASHTAGS AND ADD THEM TO THE USER
export const htagCounter = (e) => {
	// Validate hashtag
	const message = e.content.toString();
	const sender = e.member;
	const senderId = sender.user.id.toString();

	// VALID SUBMISSION
	let topic = validateMsg(message);

	if (!topic) return;
	console.log(topic);

	// Existing User
	let currUser = UserL.searchUser(senderId);
	console.log(`User search result: ${currUser.name}`);

	if (!currUser) {
		currUser = new User(sender);
	}

	// Give credit to user for valid entry
	currUser.addHashtag(topic);

	console.log(currUser.hashtags);

	return UserL.addUser(currUser);
};

// (VOID FUNCTION || FALSE BOOL) VALIDATE COMMANDS AND SEND REPORTS TO THE CHAT
export const cmdValidator = (e) => {
	let tokens = e.content.split(' ');
	let mention = tokens[1];
	const command = tokens[0];

	console.log(tokens);

	// Error handling
	if (!command.startsWith('!')) return;
	if (command != '!stats') return;
	if (!mention) {
		console.log('no mentions!!!');
		e.channel.send('Tag a user after the "!stats" command!');
		return;
	}

	// VALID COMMANDS

	// show all user stats
	if (mention == 'all') {
		console.log('ALL STATS!!!');
		let bigText = UserL.parseToString();

		// bigText = 'INTERNAL ERROR! (MENTION ALL/BIGTEXT ERROR)';

		return e.channel.send(bigText);
	} else if (mention) {
		// first validate if mention == topic
		if (validateTopic(mention)) {
			let bigText = UserL.singleTopicSummary(mention.toUpperCase());

			// bigText = 'INTERNAL ERROR! (MENTION TOPIC/BIGTEXT ERROR)';

			return e.channel.send(bigText);
		}
		// then validate if mention == user.name or mention == @role
		// Parse mention text (remove symbols)
		mention = parseMention(mention);

		// Validate if mention == role
		const mentionedRole = searchRole(mention);
		if (mentionedRole) {
			let bigText = UserL.roleSummary(mentionedRole);

			// bigText = 'INTERNAL ERROR! (MENTION ROLE/BIGTEXT ERROR)';

			return e.channel.send(bigText);
		}
		// Validate if mention == user.name
		// either [User object] or "false" is returned
		const mentionedUser = UserL.searchUser(mention);

		// if mention != user.name, then return false and exit operation
		if (mentionedUser) {
			let bigText = mentionedUser.parseToString();

			return e.channel.send(bigText);
		}

		return undefined;
	}

	return e.channel.send(
		'Tag an existing user/topic/role after the "!stats" command!'
	);
};
