interface Extension {
  name: string;
  urls: {
    [key: string]: string; // Maps browser name to its URL
  };
}

// Function to populate extensions for a given browser
function populateExtensions(browser: string, extensions: Extension[]) {
  const browserTab = document.getElementById(browser);
  if (browserTab) {
    const listGroup = document.createElement("ul");
    listGroup.className = "list-inline list-group";

    // Sort extensions by name
    const sortedExtensions = extensions
      .filter((extension) => extension.urls[browser]) // Filter extensions that have URLs for this browser
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort extensions by name

    sortedExtensions.forEach((extension) => {
      const listItem = document.createElement("li");
      listItem.className = "btn btn-block btn-round btn-border btn-primary";

      const link = document.createElement("a");
      link.href = extension.urls[browser];
      link.textContent = extension.name;

      listItem.appendChild(link);
      listGroup.appendChild(listItem);
    });

    // Append the list to the tab pane
    browserTab.innerHTML = ""; // Clear existing content
    browserTab.appendChild(listGroup);
  }
}

// Fetch extensions from JSON file
fetch("assets/data/extensions.json")
  .then((response) => response.json())
  .then((data: { extensions: Extension[] }) => {
    // Populate each browser tab
    populateExtensions("chrome", data.extensions);
    populateExtensions("edge", data.extensions);
    populateExtensions("firefox", data.extensions);
    populateExtensions("safari", data.extensions);
  })
  .catch((error) => console.error("Error loading extensions:", error));
