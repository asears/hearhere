const page = await host.browse("https://bing.com")
const screenshot = await page.screenshot() // returns a node.js Buffer
defImages(screenshot, { detail: "low", greyscale: true })

$`What is in the screen shot?`