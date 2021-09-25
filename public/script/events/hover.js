import checkElements from "../helpers/check-elements.js";
import getAllElementsFromPoint from "../helpers/get-elements-from-point.js";
import { getTarget } from "../helpers/get-target.js";

const mouseMove = (e) => {
	const hoveredElements = getAllElementsFromPoint(e.clientX, e.clientY);
	const hoveredElement = hoveredElements[hoveredElements.length - 2];

	const targetEl = getTarget(hoveredElement);

	if (checkElements(targetEl)) {
		return;
	}

	const highlightedElement = document.querySelector(".gthr-highlight");

	if (highlightedElement) {
		highlightedElement.classList.remove("gthr-highlight");
	}

	targetEl.classList.add("gthr-highlight");
}

export default mouseMove;
