// 5.2 USERLIST CLASS
export default class UserList {
	constructor() {
		this.data = [];
	}

	// DELETE ALL ARRAY CONTENT <THIS.DATA>
	deleteContent() {
		return (this.data = []);
	}

	// (USER || FALSE BOOL) SEARCH USER IN DATA ARRAY <THIS.DATA>
	searchUser(id) {
		console.log('searching user...');
		if (this.data.length == 0) {
			console.log('user List is empty');
			return false;
		}
		for (let user of this.data) {
			if (id == user.id) {
				console.log(`User: ${user.id} exists!`);
				return user;
			}
		}
	}

	// (UNDEFINDED) ADD USER TO DATA ARRAY <THIS.DATA> IF INEXISTENT, ELSE REPLACE WITH NEW INSTANCE
	addUser(user) {
		console.log('checking user existence');
		if (this.searchUser(user.id)) {
			console.log('initiating replacement algo');
			const pos = this.data
				.map((e) => {
					return e.id;
				})
				.indexOf(user.id);
			return this.data.splice(pos, 1, user);
		}
		return this.data.push(user);
	}

	// (INT >= 0) COUNT HASHTAGS IN ENTIRE DATASET <THIS.DATA> (SUM OF ALL USER HASHTAGS OF SINGLE TOPIC)
	countTopics(topic) {
		let counter = 0;
		for (let user of this.data) {
			if (Object.keys(user.hashtags).includes(topic)) {
				counter += user.hashtags[topic];
			}
		}
		return counter;
	}

	// (STRING) RETURN SUMMARY OF ALL AVAILABLE TOPICS (ALL USER SUMMARY)
	summaryString() {
		const mainTopics = Object.entries(topics).map((entry) =>
			entry[0].toUpperCase()
		);

		let mainString = '';

		for (const topic of mainTopics) {
			mainString += `**${topic}**: ${this.countTopics(topic)}\n`;
		}

		return mainString + '\n';
	}

	//  (STRING) RETURNS USER HASHTAG SUMMARY FOR A SINGLE TOPIC
	singleTopicSummary(topic) {
		const value = this.countTopics(topic.toUpperCase());

		let returnString = `**Topic ${topic.toUpperCase()} summary**\n\t**Total Mentions:** ${value}`;

		const allUsers = this.data
			.map((x) => {
				if (!x.parseSingleTopic(topic.toUpperCase(), false)) return;
				return `${x.name}: ${x.parseSingleTopic(
					topic.toUpperCase(),
					false
				)}\n\t`;
			})
			.sort((x, y) =>
				x.name.toUpperCase() > y.name.toUpperCase() ? 1 : -1
			)
			.join('\n');

		if (allUsers) {
			returnString += `\n\n\t${allUsers}`;
		}
		return returnString;
	}

	// (STRING || UNDEFINED) RETURNS USER HASHTAG SUMMARY FOR SINGLE ROLE
	roleSummary(role) {
		let analysisTopics = [];
		for (const key in topics) {
			console.log(`le key ${key}, le role ${role.name}`);

			const validator = topics[key].related_roles.some(
				(x) => x.toUpperCase().trim() == role.name.toUpperCase().trim()
			);
			if (validator) {
				analysisTopics.push(key.toUpperCase().trim());
			}
		}

		let returnString = `**Role "${role.name.toUpperCase()}" stats**\n`;

		for (const topic of analysisTopics.sort()) {
			returnString += `**${topic}**: ${this.countTopics(
				topic.toUpperCase()
			)}\n`;
		}

		const allUsers = this.data
			.filter((x) => x.roles.includes(role.id))
			.map((x) => {
				if (!x.parseRoleStats(role.id, analysisTopics)) return;
				return x.parseRoleStats(role.id, analysisTopics);
			})
			.sort((x, y) =>
				x.name.toUpperCase() > y.name.toUpperCase() ? 1 : -1
			)
			.join('\n');

		if (allUsers) {
			returnString += `\n${allUsers}`;
		}
		return returnString;
	}

	// (STRING) RETURNS A COMPLETE SUMMARY OF ALL HASHTAG MENTIONS BY ALL USERS
	parseToString() {
		let parseString = `All stats:\n`;
		parseString += this.summaryString();
		const allUsers = this.data
			.map((x) => {
				return `${x.parseToString()}`;
			})
			.sort((x, y) =>
				x.name.toUpperCase() > y.name.toUpperCase() ? 1 : -1
			)
			.join('\n');
		parseString += allUsers;
		return parseString;
	}
}
