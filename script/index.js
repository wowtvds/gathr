// Config
import config from "./config.js";

// Templates
import inputTemplate from "./templates/input.js";
import commentTemplate from "./templates/comment.js";

// Helpers
import addCss from "./helpers/add-css.js";
import { checkHighlightedElement } from "./helpers/check-elements.js";
import throttle from "./helpers/throttle.js";

// Vendors
import tippy from "./vendors/tippy.js";

// Events
import mouseMove from "./events/hover.js";
import click from "./events/click.js";

// Globals
const button = document.createElement("button");
button.classList.add("gthr-btn");

const overlay = document.createElement("div");
overlay.classList.add("gthr-overlay");

const dot = document.createElement("span");
dot.classList.add("gthr-dot", "gthr-dot--input");

const body = document.body;

const throttledEvent = throttle((e) => mouseMove(e), 100);

let commentMode = false;
let id = null;
let tippyInstance = null;
let comments = [];

const updateButton = () => {
	if (commentMode) {
		button.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
			Close feedback
		`;
	} else {
		button.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
			</svg>
			Give feedback
		`;
	}
}

const renderElements = () => {
	body.insertBefore(button, body.firstChild);

	button.addEventListener("click", toggleCommentMode);
}

const handleInput = (e) => {
	const placeholder = document.querySelector(".gthr-tooltip__placeholder");

	if (e.target.value) {
		placeholder.style.visibility = "hidden";
	} else {
		placeholder.style.visibility = "visible";
	}
}

const destroyTippy = () => {
	tippyInstance.destroy();
	tippyInstance = null;
}

const handlePost = async () => {
	const input = document.querySelector(".gthr-tooltip__input");

	await console.log("fetch");

	tippyInstance.destroy();
	tippyInstance = null;
}

const handleResolveComment = async () => {
	const input = document.querySelector(".gthr-tooltip__input");

	await console.log("fetch");

	tippyInstance.destroy();
	tippyInstance = null;
}

const initTippy = () => {
	tippy.setDefaultProps({
		trigger: 'click',
		allowHTML: true,
		animation: 'scale-subtle',
		arrow: false,
		duration: 100,
		maxWidth: 320,
		placement: 'bottom-end',
		interactive: true,
		ignoreAttributes: true,
		inlinePositioning: true,
		popperOptions: {
			strategy: 'fixed'
		},
		onShown() {
			const input = document.querySelector(".gthr-tooltip__input");
			const resolveBtn = document.querySelector(".gthr-tooltip__resolve");

			if (input) {
				input.addEventListener("input", handleInput);
			}

			if (resolveBtn) {
				resolveBtn.addEventListener("click", handleResolveComment);
			}
		},
		onHidden() {
			const input = document.querySelector(".gthr-tooltip__input");
			const resolveBtn = document.querySelector(".gthr-tooltip__resolve");

			if (input) {
				input.removeEventListener("input", handleInput);
			}

			if (resolveBtn) {
				resolveBtn.removeEventListener("click", handleResolveComment);
			}
		}
	});
}

const addComment = (el) => {
	dot.textContent = comments.length + 1;

	if (!el.style.position) {
		el.style.position = "relative";
	}

	el.appendChild(dot);
}

const handleCommentMode = () => {
	body.addEventListener("click", (e) => click(e, addComment));
	body.addEventListener("mousemove", throttledEvent, false);

	body.appendChild(overlay);
}

const cleanupCommentMode = () => {
	body.removeEventListener("click", (e) => click(e, addComment));
	body.removeEventListener("mousemove", throttledEvent, false);

	checkHighlightedElement();

	overlay.remove();
	dot.remove();
}

const toggleCommentMode = (e) => {
	e.stopPropagation();

	commentMode = !commentMode;

	updateButton();

	if (commentMode) {
		setTimeout(handleCommentMode);
	} else {
		cleanupCommentMode();
	}
}

const placeComments = () => {
	for (let i = 0; i < comments.length; i++) {
		const comment = comments[i];

		const el = document.querySelector(comment.elementSelector);

		if (!el) {
			continue;
		}

		const dot = document.createElement("span");
		dot.classList.add("gthr-dot");

		dot.textContent = i + 1;

		if (!el.style.position) {
			el.style.position = "relative";
		}

		el.appendChild(dot);

		tippy(dot, {
			content: commentTemplate({
				text: comment.text,
				resolved: comment.resolved,
				email: comment.email,
				action: () => handleResolveComment(comment.id, comment.resolved)
			}),
		});
	}
}

const getComments = async () => {
	const res = await fetch(`${config.BASE_URL}/api/comments?projectId=${id}`);
	comments = await res.json();

	console.log(comments);
	initTippy();
	placeComments();
}

const init = async () => {
	addCss("https://unpkg.com/tippy.js@6/animations/scale-subtle.css");
	addCss(`${config.BASE_URL}/script/main.css`);

	const scriptElement = document.querySelector(`script[src^='${config.BASE_URL}/script']`);
	id = scriptElement.src.split("?id=")[1];

	await getComments();

	updateButton();
	renderElements();
}

init();
