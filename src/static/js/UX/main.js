import * as Events from "./events.js"


/* Buttons UX functionality */
export function setButtonsUX() {
    
    const expandButtons = document.querySelectorAll("[expand-element]");
    expandButtons.forEach(button => {
        button.addEventListener("click", () => {
            Events.expandEvent(button);
        });
    });

    const displayButtons = document.querySelectorAll("[display-element]");
    displayButtons.forEach(button => {
        button.addEventListener("click", () => {
            Events.displayEvent(button);
        });
    });

    const visibleButtons = document.querySelectorAll("[visible-element]");
    visibleButtons.forEach(button => {
        button.addEventListener("click", () => {
            Events.visibleEvent(button);
        });
    });
}