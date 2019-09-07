import * as relations from './relations.js'


// initialize regex highlighter of
// the first code area
regexOutput.highlighter
	.defineRule(/"(?:\\.|[^"])*"/g, 'quoted')
	.defineRule(/'(?:\\.|[^'])'/g,	'quoted')
	.defineRule(/\b(var|val|const|if|else|while|for|when|fun|return|operator)\b/g, 'keyword')
	.defineRule(/[-+]?[0-9]*\.?[0-9]+(?:(?:e|E)[-+]?[0-9]+)?/g, 			 'number')
	.defineRule(/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g, 'function-call')
	.defineRule(/\b(Double|Float|Long|Int|Short|Byte|Boolean|Char|String)\b/g, 'primitive')


const scopes = {
	'single_quote_scope': {
		'style_class': 'quoted',

		'patterns': {
			'\'': {
				'pop': true
			},

			'\\\\.': {
				'style_class': 'keyword'
			}
		}
	},

	'double_quote_scope': {
		'style_class': 'quoted',

		'patterns': {
			'\"': {
				'pop': true
			},

			'\\\\.': {
				'style_class': 'keyword'
			}
		}
	},

	'global': {
		'patterns': {
			'\'': {
				'style_class': 'quoted',
				'push': 'single_quote_scope'
			},

			'\"': {
				'style_class': 'quoted',
				'push': 'double_quote_scope'
			},

			'\\b(var|val|const|if|else|while|for|when|fun|return|operator)\\b': {
				'style_class': 'keyword'
			},

			'[-+]?[0-9]*\\.?[0-9]+(?:(?:e|E)[-+]?[0-9]+)?': {
				'style_class': 'number'
			},

			'\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\()': {
				'style_class': 'function-call'
			},

			'\\b(Double|Float|Long|Int|Short|Byte|Boolean|Char|String)\\b': {
				'style_class': 'primitive'
			}
		}
	}
}

// initialize regex highlighter of
// the second code area
scopedOutput.highlighter
	.setSyntax(scopes)


/**
 * Inserts a tab character
 */
function onKeyDown(input, decoration, e) {
	if (e.key == 'Tab') {
		e.preventDefault()
		relations.inject(input, decoration, '\t')

		// initiate 'input' event
		const event = new Event('input', {
			'bubbles': true,
			'cancelable': false
		})
		input.dispatchEvent(event)

		return
	}
}

first.addEventListener('keydown', e => onKeyDown(first, regexOutput, e))
second.addEventListener('keydown', e => onKeyDown(second, scopedOutput, e))