"use strict";
function populateExtensions(browser, extensions) {
    const browserTab = document.getElementById(browser);
    if (browserTab) {
        const listGroup = document.createElement("ul");
        listGroup.className = "list-inline list-group";
        const sortedExtensions = extensions
            .filter((extension) => extension.urls[browser])
            .sort((a, b) => a.name.localeCompare(b.name));
        sortedExtensions.forEach((extension) => {
            const listItem = document.createElement("li");
            listItem.className = "btn btn-block btn-round btn-border btn-primary";
            const link = document.createElement("a");
            link.href = extension.urls[browser];
            link.textContent = extension.name;
            listItem.appendChild(link);
            listGroup.appendChild(listItem);
        });
        browserTab.innerHTML = "";
        browserTab.appendChild(listGroup);
    }
}
fetch("assets/data/extensions.json")
    .then((response) => response.json())
    .then((data) => {
    populateExtensions("chrome", data.extensions);
    populateExtensions("edge", data.extensions);
    populateExtensions("firefox", data.extensions);
    populateExtensions("safari", data.extensions);
})
    .catch((error) => console.error("Error loading extensions:", error));
