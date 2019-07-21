import * as format from './format.js'


/**
 * Handler that does nothing
 */
class EmptyHandler {
	constructor() {

	}

	/**
	 * Highlights the text
	 */
	highlight(text) {
		return text
	}
}


/**
 * Handler that may contain regex rules
 * for code highlighting
 */
class RegexHandler extends EmptyHandler {
	constructor() {
		super()

		/**
		 * (Regex, Style Class) rule pairs
		 */
		this.rules = []
	}

	/**
	 * Adds a rule for highlighting
	 */
	defineRule(regex, styleClass) {
		this.rules.push({ regex: regex, styleClass: styleClass })
		return this
	}

	/**
	 * Highlights the text
	 */
	highlight(text) {
		for (let each of this.rules)
			text = text.replace(each.regex, it => format.wrap(it, each.styleClass))
		return text
	}
}


/**
 * TODO: finish it
 *
 * Handler that does highlighting
 * by contextual rules
 */
class ScopedHandler extends EmptyHandler {
	constructor() {
		super()
	}

	/**
	 * Highlights the text
	 */
	highlight(text) {
		return text
	}
}


/**
 * Register observations
 */
function assignObservables() {
	const observers = document.querySelectorAll('[data-observe]')

	for (let each of observers) {
		const handler = each.dataset.handler

		if (handler == 'regex')
			each.handler = new RegexHandler()
		else
			each.handler = new EmptyHandler()

		const observable = document.querySelector(each.dataset.observe)

		if (observable) {
			observable.addEventListener('input', e => {
				const escaped = format.escape(observable.value)
				const value = each.handler.highlight(escaped)
				each.innerHTML = format.divide(value)
			})
		}
	}
}


// main
assignObservables()

const Kotlin = {
	DOUBLE_QUOTED: /"[^"]*"/g,
	SINGLE_QUOTED: /'[^']'/g,
	KEYWORDS: /\b(var|val|if|else|while|for|when|fun|return|operator)\b/g,
	NUMBERS: /[-+]?[0-9]*\.?[0-9]+(?:(?:e|E)[-+]?[0-9]+)?/g,
	FUNCTION_CALL: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
}

regexOutput.handler
	.defineRule(Kotlin.DOUBLE_QUOTED, 	'quoted')
	.defineRule(Kotlin.SINGLE_QUOTED, 	'quoted')
	.defineRule(Kotlin.KEYWORDS, 		'keyword')
	.defineRule(Kotlin.NUMBERS, 		'number')
	.defineRule(Kotlin.FUNCTION_CALL, 	'function-call')