// 5.1 USER CLASS
class User {
	constructor(nativeUser) {
		this.id = nativeUser.user.id.toString();
		this.name = nativeUser.user.username.toString();
		this.roles = nativeUser.roles.cache.map((x) => x.id);
		this.hashtags = {};
		this.data = nativeUser;
	}

	// ADD HASHTAG TO USER COUNT
	addHashtag(topic) {
		topic = topic.toUpperCase();
		console.log(`adding hashtag: ${topic}`);
		if (!this.hashtags[topic]) {
			this.hashtags[topic] = 0;
		}
		return (this.hashtags[topic] += 1);
	}

	// (INT || UNDEFINED) SINGLE TOPIC HASHTAG COUNT
	parseSingleTopic(topic, bin = false) {
		if (!this.hashtags[topic] && !bin) return;
		if (!this.hashtags[topic] && bin) return 0;
		return this.hashtags[topic];
	}

	// (STRING || UNDEFINED) ROLE RELEVANT HASHTAG COUNT
	parseRoleStats(roleId, topicsArr) {
		if (!this.roles.includes(roleId)) return;
		let parseString = `**${this.name}**:\n\t`;
		for (const topic of topicsArr) {
			parseString += `${topic}: ${this.parseSingleTopic(
				topic,
				true
			)}\n\t`;
		}
		return parseString;
	}

	// (STRING) ENTIRE HASHTAG COUNT
	parseToString() {
		let parseString = `**${this.name}'s** stats:\n\t`;
		const allEntries = Object.entries(this.hashtags)
			.map((x) => {
				return `${x[0]}: ${x[1]}`;
			})
			.join('\n\t');
		parseString += allEntries;
		return parseString;
	}
}

module.exports = User;
