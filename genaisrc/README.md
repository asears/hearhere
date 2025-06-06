# GenAIScript

- Run Fix GenAI Script Types to generate tsconfig.json and allow for syntax highlighting
- Configure settings for Copilot by default

GenAIScript will detect any file matching *.genai.mjs, *.genai.js, *.genai.mts in your workspace.
GenAIScript files can be placed anywhere in your workspace; but the extension will place them in a genaisrc folder by default.
.genai.mjs use module JavaScript syntax and support imports.
.genai.js are eval-ed and do not support imports.
.genai.mts are TypeScript module files and support imports, including dynamic imports of other TypeScript files.
Directory/genaisrc
jsconfig.json
// TypeScript compiler configuration
genaiscript.d.ts
// TypeScript definitions
myscript.genai.mjs
// your script!
…
system.*.genai.mjs are considered system prompt templates and are unlisted by default.


## .mdx extension

JSX in Markdown

https://kabartolo.github.io/chicago-docs-demo/docs/mdx-guide/writing/

## Github Models Action

https://microsoft.github.io/genaiscript/getting-started/automating-scripts/

```yaml
permissions:
    models: read
...
- run: npx --yes genaiscript run <script> <...files> --provider github
- run: npx --yes genaiscript run ... --out-trace $GITHUB_STEP_SUMMARY
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

If your GitHub Action is triggered by a pull request event, you can use the following flags to add comments: description, conversation and reviews.

This could also be triggered by slash commands.

## Excel

const sheets = await parsers.XLSX(env.files[0])

## HTML To Non Github Flavor Markdown

const markdown = HTML.HTMLToMarkdown(htmlContent, { disableGfm: true })

## AST Grep Playground

https://ast-grep.github.io/playground.html

## Playwright Browser Automation

npx playwright install --with-deps chromium

https://microsoft.github.io/genaiscript/reference/scripts/browser/

Chrome Devtools Protocol (CDP)

https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp

## Record Video

Record a video of a PR, stepping through the files and annotating the video with closed captions describing the changes or demoing the features.  Generate audio.

const page = await host.browse(url, { recordVideo: true })
