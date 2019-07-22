import * as format from './format.js'


/**
 * Handler that does nothing
 */
export class EmptyHighlighter {
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
export class RegexHighlighter extends EmptyHighlighter {
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
 * Defines a parsing context
 */
export class Scope {
	constructor(styleClass, transitions = {}) {
		this.transitions = transitions
		this.styleClass = styleClass
	}

	/**
	 * Wraps a portion of text with it's
	 * styleClass
	 */
	finalize(text, start, end) {
		const read = text.substring(start, end)
		const wrapped = format.wrap(read, this.styleClass)
		const result = format.insert(text, wrapped, start, end - start)
		return [result, end - read.length + wrapped.length]
	}

	/**
	 * Tests if the next part of text
	 * satisfies the pattern
	 */
	lookAhead(pattern, text, start) {
		const regex = new RegExp(pattern, 'g')
		const matches = regex.exec(text.substring(start))

		if (matches != null && matches.index == 0)
			return matches[0]

		return null
	}

	/**
	 * Highlights the next part of text
	 */
	proceed(text, index) {
		let it = index;

		while (it < text.length) {
			let found = false

			for (let each of Object.keys(this.transitions)) {
				const item = this.transitions[each]
				const match = this.lookAhead(each, text, it)

				if (match != null) {
					let styled = match

					if (item.styleClass)
						styled = format.wrap(match, item.styleClass)

					text = format.insert(text, styled, it, match.length)
					it += styled.length
					found = true

					if (item.pop)
						return this.finalize(text, index, it)

					if (item.push)
						[text, it] = item.push.proceed(text, it)

					break
				}
			}

			if (!found)
				it++
		}

		return this.finalize(text, index, it)
	}
}

/**
 * TODO: finish it
 *
 * Handler that does highlighting
 * by contextual rules
 */
export class ScopedHighlighter extends EmptyHighlighter {
	constructor() {
		super()

		/**
		 * Stack of contexts
		 */
		this.scopes = []
	}

	/**
	 * Adds a scope
	 */
	pushScope(scope) {
		this.scopes.push(scope)
	}

	/**
	 * Returns the last added scope
	 */
	getLastScope() {
		return this.scopes[this.scopes.length - 1]
	}

	/**
	 * Highlights the text
	 */
	highlight(text) {
		const top = this.getLastScope()

		if (top) {
			const [result, index] = top.proceed(text, 0)
			return result
		}

		return text
	}
}


/**
 * Initializes value observation
 * for the given element
 */
export function assignObservable(element) {
	const highlighter = element.dataset.highlighter

	if (highlighter == 'regex')
		element.highlighter = new RegexHighlighter()
	else if (highlighter == 'scoped')
		element.highlighter = new ScopedHighlighter()
	else
		element.highlighter = new EmptyHighlighter()

	const observable = document.querySelector(element.dataset.observe)

	if (observable) {
		observable.addEventListener('input', e => {
			const escaped = format.escape(observable.value)
			const value = element.highlighter.highlight(escaped)
			element.innerHTML = format.divide(value)
		})
	}
}


/**
 * Register observations
 */
export function assignAllObservables() {
	const observers = document.querySelectorAll('[data-observe]')

	for (let each of observers) {
		assignObservable(each)
	}
}