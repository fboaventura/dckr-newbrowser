# dckr-newbrowser

With browsers creating empty profiles for different accounts or usage, it can be a pain to keep the commonly used
extensions installed. This page has links to the extensions I use, separated by browser.

The page was built using the [HTML5 Boilerplate](https://html5boilerplate.com/)
and [Creative-Tim](https://www.creative-tim.com/)'
s [Papper Kit 2](https://demos.creative-tim.com/paper-kit-2/index.html). The hero image and the logo icon where created
using [Midjourney](https://www.midjourney.com/).

## The JSON file

The extensions are loaded from a JSON file located at `/app/www/assets/data/extensions.json`. The file is structured as
follows:

```json
{
  "extensions": [
    {
      "name": "1Password",
      "urls": {
        "chrome": "https://chrome.google.com/webstore/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa",
        "edge": "https://microsoftedge.microsoft.com/addons/detail/1password-%E2%80%93-password-mana/dppgmdbiimibapkepcbdbmkaabgiofem",
        "firefox": "https://addons.mozilla.org/en-US/firefox/addon/1password-x-password-manager",
        "safari": "https://apps.apple.com/br/app/1password-for-safari/id1569813296?mt=12"
      }
    },
    {
      "name": "Raindrop.io",
      "urls": {
        "chrome": "https://chrome.google.com/webstore/detail/raindropio/ldgfbffkinooeloadekpmfoklnobpien",
        "edge": "https://microsoftedge.microsoft.com/addons/detail/raindropio/lpngnnjemnkjmgpoolldhiejhkmmgfge",
        "firefox": "https://addons.mozilla.org/en-US/firefox/addon/raindropio/",
        "safari": "https://apps.apple.com/br/app/save-to-raindrop-io/id1549370672?mt=12"
      }
    }
  ]
}
```

The `extensions` array contains objects with the `name` of the extension and the `urls` object with the links to the
extension in the different browsers. These will be loaded and used to populate the page, placing the links in the
correct browser section.

To have control and customize the extenions list, it is possible to overwrite the JSON file by mounting a volume to the
container. The file should be placed at `/app/www/assets/data/extensions.json`.

## Running the container

The container can be run using either the command line or Docker Compose. In both cases the JSON file should be mounted
to the container. Since it uses [Caddy](https://caddyserver.com/) to serve the page, it is possible to pass a `DOMAIN`
environment variable to set the domain name. This is useful when running the container behind a reverse proxy.

### Command Line

To run the container, use the following command:

```bash
docker run -d -p 8080:80 --name newbrowser -v /path/to/extensions.json:/app/www/assets/data/extensions.json dckr-newbrowser
```

Replace `/path/to/extensions.json` with the path to the JSON file you want to use.

### Docker Compose

To run the container using Docker Compose, use the following `docker-compose.yml` file:

```yaml
---
services:
  web:
    container_name: newbrowser
    image: fboaventura/dckr-newbrowser:latest
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      DOMAIN: ""
    ports:
      - "8081:80"
    volumes:
      - ./extensions.json:/app/www/assets/data/extensions.json
```

Replace `./extensions.json` with the path to the JSON file you want to use.

## License

The code is available under the [MIT license](LICENSE.txt).
