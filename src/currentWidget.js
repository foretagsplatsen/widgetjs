let currentWidget;

export function getCurrentWidget() {
	return currentWidget;
}

export function setCurrentWidget(widget) {
	currentWidget = widget;
}

/**
 * Set `widget` as the current widget while evaluating `fn`.
 */
export function withCurrentWidget(fn, widget) {
	let previousCurrent = getCurrentWidget();

	try {
		setCurrentWidget(widget);
		fn();
	} finally {
		setCurrentWidget(previousCurrent);
	}
}
