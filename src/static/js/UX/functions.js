/* ---------------------------- UX FUNCTIONALITY ---------------------------- */
/* Add events to every data-action and data-section HTML element */
const applyUX = () => {
    const uxElements = document.querySelectorAll('.ux-event');
    uxElements.forEach( function(element){
        const section = element.getAttribute("data-section");
        const action = element.getAttribute("data-action");
        const elementToEvent = document.querySelector(`[data-content = '${section}']`);
        if(elementToEvent != null) {
            switch (action) {
                case "hide-element":
                    element.addEventListener("click", () => {
                        elementToEvent.ariaHidden = elementToEvent.ariaHidden !== 'true'; })
                    break
                case "expand-element":
                    if(section === "Sidebar"){
                        const hideSidebar = document.getElementById('collapse-sidebar');
                        element.addEventListener("click", () => {
                            elementToEvent.ariaExpanded = elementToEvent.ariaExpanded !== 'true';
                            if(elementToEvent.ariaExpanded === "false"){
                                hideSidebar.setAttribute("data-title", "Open panel");
                            } else {
                                hideSidebar.setAttribute("data-title", "Close panel");
                            }
                        });
                    } else {
                        element.addEventListener("click", () => {
                            elementToEvent.ariaExpanded = elementToEvent.ariaExpanded !== 'true';
                        });
                    }
                    break
                case "change-sidebar":
                    element.addEventListener("click", () => {
                        if(elementToEvent.ariaHidden == 'true'){
                            elementToEvent.ariaHidden = 'false';
                            const areaSections = document.querySelectorAll(".area-section");
                            areaSections.forEach(function(areaToShow){
                                if(areaToShow.getAttribute("data-content") != section){
                                    areaToShow.ariaHidden = 'true';
                                }
                            });
                        }
                        if(sidebar.ariaExpanded == 'false'){
                            hideSidebar.dispatchEvent(new Event("click"));
                        }
                    })
                    break
                }   
                
            }
    });
}

/* ---------------------------- MAIN ---------------------------- */
export function DocumentUX(){
    /* User Experience events */
    applyUX();
}