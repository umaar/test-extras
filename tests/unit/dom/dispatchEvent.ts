import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import dispatchEvent from '../../../src/dom/dispatchEvent';

registerSuite({
	name: 'dom/dispatchEvent',

	'custom event'() {
		const target = document.createElement('div');
		document.body.appendChild(target);

		function listener(evt: CustomEvent) {
			assert.strictEqual(evt.type, 'foo', 'event type should be "foo"');
			assert.isFalse(evt.bubbles, 'event should not bubble');
			assert.isFalse(evt.cancelable, 'event should not be cancelable');

			target.removeEventListener('foo', listener);
			document.body.removeChild(target);
		}

		target.addEventListener('foo', listener);

		dispatchEvent({
			target,
			type: 'foo'
		});
	},

	'bubbles/cancelable'() {
		const target = document.createElement('div');
		document.body.appendChild(target);

		function listener(evt: CustomEvent) {
			assert.property(evt, 'preventDefault', 'preventDefault should be included');
			assert.isTrue(evt.bubbles, 'event should bubble');
			assert.isTrue(evt.cancelable, 'event should be cancelable');

			target.removeEventListener('foo', listener);
			document.body.removeChild(target);
		}

		target.addEventListener('foo', listener);

		dispatchEvent({
			target,
			type: 'foo',
			eventInit: {
				bubbles: true,
				cancelable: true
			}
		});
	},

	'MouseEvents'() {
		const target = document.createElement('button');
		document.body.appendChild(target);

		function listener(evt: MouseEvent) {
			assert.strictEqual(evt.type, 'click', 'event type should be "click"');
			assert.instanceOf(evt, (<any> window).MouseEvent, 'event should be an instance of MouseEvent');
			assert.strictEqual(evt.clientX, 50);
			assert.strictEqual(evt.clientY, 50);

			target.removeEventListener('click', listener);
			document.body.removeChild(target);
		}

		target.addEventListener('click', listener);

		const eventInit: MouseEventInit = {
			cancelable: true,
			bubbles: false,
			clientX: 50,
			clientY: 50
		};

		dispatchEvent({
			target,
			type: 'click',
			eventClass: 'MouseEvent',
			eventInit
		});
	},

	'selector'() {
		const target = document.createElement('div');
		const button = document.createElement('button');
		target.appendChild(button);
		document.body.appendChild(target);

		function wronglistener() {
			throw new Error('Wrong listener called');
		}

		function listener(evt: CustomEvent) {
			assert.strictEqual(evt.target, button);

			button.removeEventListener('foo', listener);
			target.removeEventListener('foo', wronglistener);
			document.body.removeChild(target);
		}

		target.addEventListener('foo', wronglistener);
		button.addEventListener('foo', listener);

		dispatchEvent({
			selector: 'button',
			target,
			type: 'foo'
		});
	},

	'bad selector throws'() {
		const target = document.createElement('div');
		document.body.appendChild(target);

		assert.throws(() => {
			dispatchEvent({
				selector: 'button',
				target,
				type: 'foo'
			});
		}, Error, 'Cannot resolve to an element with selector');

		document.body.removeChild(target);
	}
});
