module.exports = {
	root: true,

	extends: [
		"airbnb-base",
		"plugin:vue/essential"
	],

	rules: {
		indent: [
			'error',
			'tab'
		],
		'no-tabs': 0,
		'import/no-unresolved': [
			2,
			{
				ignore: [
					'^rollup-plugin*',
					'^./components',
					'^./<%-componentName%>.vue'
				]
			}
		],
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
	},

	env: {
		node: true
	},

	parserOptions: {
		ecmaVersion: 2020
	}
};
