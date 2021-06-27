// 1. ===== IMPORTS =====

// 1.1 MODULES
const Sensitive = require('./modules/data');
const User = require('./modules/User');
const UserList = require('./modules/UserList');

// 1.2 PACKAGES
const Discord = require('discord.js');
const schedule = require('node-schedule');

// 2. ===== CREATE CLIENT =====
const client = new Discord.Client();
client.login(Sensitive.login);

// 3. ===== DECLARE AND INITIALIZE VARS =====

// 3.1 BOT CHANNEL ID
const chatChannelId = Sensitive.channelId;

// 3.2 TOPICS WITH RELATED ROLES
const topics = {
	TA: {
		related_roles: ['el presidente'],
	},
	xd: {
		related_roles: ['el presidente'],
	},
	NoNo: {
		related_roles: ['puss'],
	},
};

// 3.3 USER ROLES LIST
let roles = {};

// 6. ===== MAIN PROCESSES =====

const UserL = new UserList();
const reset = schedule.scheduleJob(
	// dayOfWeek (0-6) Starting with Sunday
	{ hour: 20, minute: 00, dayOfWeek: 0 },
	() => {
		UserL.deleteContent();
	}
);

client.on('ready', () => {
	console.log('CounterBot is Online!');
});

// 6.1 COLLECT MESSAGES

client.on('message', async (e) => {
	const activeChannel = e.channel.id.toString();

	// if channel != bot channel, validate hashtags only
	if (activeChannel != chatChannelId) {
		return htagCounter(e);
	}

	// Update Roles List
	updateRoles(e);

	// validate commands
	cmdValidator(e);
});
