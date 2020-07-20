module.exports = {
	root: true,
	extends: [
		"airbnb-base",
	],
	rules: {
		// Using tab
		"indent": ["error", "tab"],
		"no-tabs": 0,
		// Ignore unresolved imports in template files
		'import/no-unresolved': [
			2,
			{
				ignore: [
					'^rollup-plugin*',
					'^./components',
					'^./<%-componentName%>.vue'
				],
			},
		],
	},
};
