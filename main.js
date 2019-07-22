import * as relations from './relations.js'

relations.assignAllObservables()


// initialize regex highlighter of
// the first code area
regexOutput.highlighter
	.defineRule(/"[^"]*"/g, 'quoted')
	.defineRule(/'[^']'/g,	'quoted')
	.defineRule(/\b(var|val|if|else|while|for|when|fun|return|operator)\b/g, 'keyword')
	.defineRule(/[-+]?[0-9]*\.?[0-9]+(?:(?:e|E)[-+]?[0-9]+)?/g, 			 'number')
	.defineRule(/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g, 'function-call')
	.defineRule(/\b(Double|Float|Long|Int|Short|Byte|Boolean|Char|String)\b/g, 'primitive')


const singleQuoteScope = new relations.Scope('quoted', {
	'\'': {
		'pop': true
	},

	'\\\\.': {
		'styleClass': 'keyword'
	}
})

const doubleQuoteScope = new relations.Scope('quoted', {
	'\"': {
		'pop': true
	},

	'\\\\.': {
		'styleClass': 'keyword'
	}
})

const globalScope = new relations.Scope('', {
	'\'': {
		'styleClass': 'quoted',
		'push': singleQuoteScope
	},

	'\"': {
		'styleClass': 'quoted',
		'push': doubleQuoteScope
	},

	'\\b(var|val|if|else|while|for|when|fun|return|operator)\\b': {
		'styleClass': 'keyword'
	},

	'[-+]?[0-9]*\\.?[0-9]+(?:(?:e|E)[-+]?[0-9]+)?': {
		'styleClass': 'number'
	},

	'\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\()': {
		'styleClass': 'function-call'
	},

	'\\b(Double|Float|Long|Int|Short|Byte|Boolean|Char|String)\\b': {
		'styleClass': 'primitive'
	}
})

// initialize regex highlighter of
// the second code area
scopedOutput.highlighter
	.pushScope(globalScope)