---
marp: true
theme: default
paginate: true
header: "GenAIScript"
footer: "Microsoft | 2025"
---

# GenAIScript

## A Powerful JavaScript/TypeScript Toolbox for LLMs

![GenAIScript bg right:40% 80%](https://microsoft.github.io/genaiscript/images/favicon.svg)

- Seamless Visual Studio Code integration
- Multiple LLM provider support
- Extensive tooling for prompt engineering
- Built-in RAG capabilities

---

# Setup in VS Code

1. Install VS Code Extension:
```bash
code --install-extension microsoft.genaiscript
```

2. Configure environment:
```bash
npx genaiscript init
```

3. Set up provider credentials in `.env`:
```env
OPENAI_API_KEY=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_ENDPOINT=...
```

---

# GitHub Copilot Integration

```javascript
script({
  model: "github:copilot-gpt4",
  // Configuration
})
```

Key Features:
- Direct integration with GitHub Copilot Chat
- Access to GPT-4 and other models
- Seamless authentication with GitHub credentials
- Built-in rate limiting and error handling

---

# Working with Files

## Markdown Processing

```javascript
// Read and process markdown
const mdFile = await workspace.readText("doc.md")
def("CONTENT", mdFile)

$`Analyze and summarize the CONTENT.`
```

## Code Analysis

```javascript
// Process code files
const code = await workspace.readText("app.ts")
def("CODE", code)

$`Review this TypeScript code and suggest improvements.`
```

---

# GitHub Actions Integration

```yaml
name: GenAIScript Workflow
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run GenAIScript Analysis
        uses: microsoft/genaiscript-action@v1
        with:
          script: analyze.genai.mjs
          token: ${{ secrets.GITHUB_TOKEN }}
```

---

# Slash Commands in Issues/PRs

```bash
/genaiscript analyze
/genaiscript test
/genaiscript docs
/genaiscript review
```

Features:
- Automated test generation and updates
- Documentation analysis and suggestions
- Pull request reviews
- Sentiment analysis on comments
- Comprehensive documentation generation

---

# Teams Integration

```javascript
// After az login
const teams = await host.teams({
  tenantId: process.env.AZURE_TENANT_ID
});

// Send message to Teams channel
await teams.sendMessage({
  channelId: "channel-id",
  message: "Analysis complete!",
  attachments: [...],
});
```

---

# Advanced Features

- RAG (Retrieval Augmented Generation)
- Custom agents and tool chaining
- Content safety checks
- Vector search capabilities
- Browser automation
- PDF, DOCX, and other document processing
- Image and video processing

---

# Resources

- [Documentation](https://microsoft.github.io/genaiscript/)
- [GitHub Repository](https://github.com/microsoft/genaiscript)
- [Discord Community](https://discord.gg/y7HpumjHeB)
- [Blog](https://microsoft.github.io/genaiscript/blog)
- [API Reference](https://microsoft.github.io/genaiscript/reference/)

---

# Questions?

![GenAIScript bg right:40% 80%](https://microsoft.github.io/genaiscript/images/favicon.svg)

Join our community:
- Discord: discord.gg/y7HpumjHeB
- GitHub: github.com/microsoft/genaiscript
- Docs: microsoft.github.io/genaiscript
