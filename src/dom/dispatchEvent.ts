import has, { add as hasAdd } from '@dojo/core/has';
import { assign } from '@dojo/core/lang';

hasAdd('customevent-constructor', () => {
	try {
		new window.CustomEvent('foo');
		return true;
	}
	catch (e) {
		return false;
	}
});

export type EventClass =
	'AnimationEvent' |
	'AudioProcessingEvent' |
	'BeforeInputEvent' |
	'BeforeUnloadEvent' |
	'BlobEvent' |
	'ClipboardEvent' |
	'CloseEvent' |
	'CompositionEvent' |
	'CSSFontFaceLoadEvent' |
	'CustomEvent' |
	'DeviceLightEvent' |
	'DeviceMotionEvent' |
	'DeviceOrientationEvent' |
	'DeviceProximityEvent' |
	'DOMTransactionEvent' |
	'DragEvent' |
	'EditingBeforeInputEvent' |
	'ErrorEvent' |
	'FetchEvent' |
	'FocusEvent' |
	'GamepadEvent' |
	'HashChangeEvent' |
	'IDBVersionChangeEvent' |
	'InputEvent' |
	'KeyboardEvent' |
	'MediaStreamEvent' |
	'MessageEvent' |
	'MouseEvent' |
	'MutationEvent' |
	'OfflineAudioCompletionEvent' |
	'PageTransitionEvent' |
	'PointerEvent' |
	'PopStateEvent' |
	'ProgressEvent' |
	'RelatedEvent' |
	'RTCDataChannelEvent' |
	'RTCIdentityErrorEvent' |
	'RTCIdentityEvent' |
	'RTCPeerConnectionIceEvent' |
	'SensorEvent' |
	'StorageEvent' |
	'SVGEvent' |
	'SVGZoomEvent' |
	'TimeEvent' |
	'TouchEvent' |
	'TrackEvent' |
	'TransitionEvent' |
	'UIEvent' |
	'UserProximityEvent' |
	'WebGLContextEvent' |
	'WheelEvent';

export interface DispatchOptions {
	/**
	 * The event class to use to create the event, defaults to `CustomEvent`
	 */
	eventClass?: EventClass;

	/**
	 * An object which is used to initialise the event
	 */
	eventInit?: EventInit;

	/**
	 * A CSS selector string, used to query the target to identify the element to
	 * dispatch the event to
	 */
	selector?: string;

	/**
	 * The element to dispatch the event to
	 */
	target: Element;
}

export interface EventInitializer {
	(bubbles: boolean, cancelable: boolean): void;
}

/**
 * Create and dispatch an event to an element
 * @param type The event type to dispatch
 * @param options A map of options to configure the event
 */
export default function dispatchEvent(type: string, options: DispatchOptions) {
	const {
		eventClass = 'CustomEvent',
		eventInit = {},
		selector,
		target
	} = options;
	let event: Event;
	if (has('customevent-constructor')) {
		if (eventClass in window) {
			event = new ((<any> window)[eventClass] as typeof Event)(type, eventInit);
		}
		else {
			event = new window.CustomEvent(type, eventInit);
		}
	}
	else {
		event = document.createEvent(eventClass);
		const { bubbles = false, cancelable = false, ...initProps } = eventInit;
		((<any> event)[`init${eventClass}`] as EventInitializer)(bubbles, cancelable);
		assign(event, initProps);
	}
	if (selector) {
		const selectorTarget = target.querySelector(selector);
		if (selectorTarget) {
			selectorTarget.dispatchEvent(event);
		}
		else {
			throw new Error(`Cannot resolve to an element with selector "${selector}"`);
		}
	}
	else {
		target.dispatchEvent(event);
	}
}
