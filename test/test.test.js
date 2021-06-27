const Functions = require('../modules/Functions');

describe('Basic Hashtag Counter Rundown', () => {
	// Declare useful variables
	const topics = {
		TA: {
			related_roles: ['el presidente'],
		},
		xd: {
			related_roles: ['el presidente'],
		},
		NoNo: {
			related_roles: ['role 2'],
		},
	};
	test('can parse mentions', () => {
		const value = '34565434567';

		const validEntries = [`<@!${value}>`, `<@&${value}>`, `<@${value}>`];
		const invalidEntries = [
			`${value}`,
			`<!${value}>`,
			`@!${value}>`,
			`<@!${value}`,
			`<@!>`,
		];

		// Valid scenarios
		for (const item of validEntries) {
			let mentionValid = Functions.parseMention(item);
			expect(mentionValid).toBe(value);
		}

		// Invalid scenarios
		for (const item of invalidEntries) {
			let mentionInvalid = Functions.parseMention(item);
			expect(mentionInvalid).toBeFalsy();
		}
	});
});
