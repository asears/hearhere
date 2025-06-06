# GenAIScript Documentation

## Overview

GenAIScript is a powerful JavaScript/TypeScript-based toolbox for working with large language models (LLMs) that brings essential prompt engineering and LLM integration capabilities into a cohesive scripting environment. It provides seamless integration with Visual Studio Code and supports multiple LLM providers including GitHub Copilot, OpenAI, Azure OpenAI, Azure AI Foundry, and more.

## Key Features

### 1. Prompt Engineering
- JavaScript/TypeScript syntax for building prompts
- Template literals with variable interpolation
- System prompts and context management
- Prompt caching and optimization
- Support for multiple input formats (text, code, markdown)

### 2. LLM Integration
- Built-in support for multiple providers:
  - GitHub Models
  - Azure OpenAI
  - OpenAI
  - Azure AI Foundry
  - GitHub Copilot Chat
  - Many others (Anthropic, Google AI, Hugging Face, etc.)
- Model aliases for consistent interface
- Error handling and retry logic
- Rate limiting and cost management

### 3. Tools and Extensions
- File system operations
- Web search and retrieval
- Browser automation
- Vector search and RAG capabilities
- Image/video processing
- PDF/DOCX parsing
- Secret scanning
- Content safety checks

### 4. Development Features
- Fast development loop with VS Code
- Debugging support
- Testing framework
- CI/CD integration
- Performance monitoring
- Error logging

### 5. Advanced Capabilities
- Agents and tool chaining
- Schema validation
- Data transformation
- Vector embeddings
- Container support
- Browser automation
- Custom output formats

## Installation and Setup

### Prerequisites
1. Node.js and npm/pnpm
2. Visual Studio Code
3. Access to desired LLM provider(s)

### Installation Steps
1. Install the VS Code extension:
   ```bash
   # Via VS Code marketplace
   code --install-extension microsoft.genaiscript

   # Or via CLI
   npm install -g @microsoft/genaiscript
   ```

2. Configure environment:
   ```bash
   # Create configuration files
   npx genaiscript init
   ```

3. Set up provider credentials in `.env`:
   ```env
   OPENAI_API_KEY=...
   AZURE_OPENAI_API_KEY=...
   AZURE_OPENAI_API_ENDPOINT=...
   ```

## Basic Usage

### 1. Simple Prompt
```javascript
// hello.genai.mjs
script({
  $`Write a 'hello world' poem.`
})
```

### 2. With Context
```javascript
// analyze.genai.mjs
const file = await workspace.readText("data.txt")
def("DATA", file)

$`Analyze DATA and extract information in JSON format.`
```

### 3. With Tools
```javascript
// weather.genai.mjs
defTool("weather", "live weather",
  { city: "string" },
  async ({ city }) => {
    // Weather API call
    return { temp: 22, condition: "sunny" }
  }
)

$`What's the weather in Paris?`
```

## Best Practices

1. **Prompt Engineering**
   - Use clear, specific instructions
   - Provide relevant context
   - Handle edge cases
   - Use system prompts for consistent behavior

2. **Error Handling**
   - Implement proper error catching
   - Add retries for transient failures
   - Log errors appropriately
   - Validate outputs

3. **Security**
   - Scan for secrets in prompts
   - Use content safety checks
   - Implement rate limiting
   - Follow provider-specific security guidelines

4. **Performance**
   - Cache responses when appropriate
   - Use streaming for large outputs
   - Optimize prompt size
   - Monitor token usage

5. **Testing**
   - Write unit tests for tools
   - Test prompts with various inputs
   - Use evaluation framework
   - Implement CI/CD checks

## Advanced Topics

### 1. RAG (Retrieval Augmented Generation)
```javascript
// Example RAG setup
const index = await retrieval.index("documents")
await index.insertOrUpdate(env.files)
const docs = await index.search("search query")
```

### 2. Agents
```javascript
// Define an agent
defAgent(
  "git",
  "Git expert agent",
  "You are a Git expert",
  { tools: ["git"] }
)

// Use the agent
script({ tools: "agent" })
$`Analyze the recent commits`
```

### 3. Custom Tools
```javascript
// Custom tool example
defTool("customTool", "description",
  { param1: "string" },
  async ({ param1 }) => {
    // Tool implementation
    return result
  }
)
```

## Testing and Evaluation

### 1. Unit Tests
```javascript
// test.genai.mjs
test("prompt test", async () => {
  const result = await runPrompt("test input")
  assert.equal(result.success, true)
})
```

### 2. Red Teaming
- Test for prompt injection vulnerabilities
- Check content safety boundaries
- Evaluate response consistency
- Test error handling

### 3. Evaluation Framework
- Define test cases with expected outputs
- Use automated testing in CI/CD
- Monitor metrics and KPIs
- Generate test reports

## Azure Integration

### Azure OpenAI
```javascript
script({
  model: "azure:deployment-id",
  // Configuration
})
```

### Azure AI Foundry
```javascript
script({
  model: "azure_ai_inference:model-id",
  // Configuration
})
```

### Azure AI Search
```javascript
const index = await retrieval.index("name", {
  type: "azure_ai_search"
})
// Use index
```

## Additional Resources

- [Official Documentation](https://microsoft.github.io/genaiscript/)
- [API Reference](https://microsoft.github.io/genaiscript/reference/)
- [Examples and Samples](https://microsoft.github.io/genaiscript/samples/)
- [Getting Started Guide](https://microsoft.github.io/genaiscript/getting-started/)
- [Best Practices Guide](https://microsoft.github.io/genaiscript/getting-started/best-practices/)
- [Debugging Guide](https://microsoft.github.io/genaiscript/getting-started/debugging-scripts/)
- [Security Guidelines](https://microsoft.github.io/genaiscript/reference/security-and-trust/)
