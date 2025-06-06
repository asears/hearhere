# GenAIScript Prompty Integration Guide

## Overview

GenAIScript provides seamless integration with Prompty, a powerful prompt templating and chaining system. This guide covers using Prompty files in GenAIScript, prompt chaining patterns, and best practices.

## Basic Integration

### 1. Importing Prompty Files
```javascript
// Import and run a Prompty template
importTemplate("prompt.prompty", {
  variables: {
    input: "Hello world"
  }
})

// Multiple templates
importTemplate([
  "system.prompty",
  "chat.prompty"
], context)
```

### 2. Basic Prompty Structure
```yaml
# template.prompty
---
name: basic_prompt
---
system:
  You are a helpful assistant.

user:
  {{query}}

assistant:
  I'll help you with {{query}}.
```

## Prompt Chaining

### 1. Sequential Chaining
```javascript
// Chain multiple prompts
const result1 = await importTemplate("step1.prompty", data)
const result2 = await importTemplate("step2.prompty", {
  ...data,
  previousResult: result1
})
```

### 2. Parallel Processing
```javascript
// Process prompts in parallel
const results = await Promise.all([
  importTemplate("part1.prompty", data),
  importTemplate("part2.prompty", data)
])
```

### 3. Conditional Chaining
```javascript
// Choose template based on conditions
const template = condition 
  ? "path1.prompty"
  : "path2.prompty"

await importTemplate(template, data)
```

## Advanced Features

### 1. Template Inheritance
```yaml
# base.prompty
---
name: base
---
system:
  {{systemPrompt}}

# specific.prompty
---
name: specific
extends: base
---
systemPrompt: |
  You are a specialized assistant.
```

### 2. Context Management
```javascript
// Manage shared context
const context = {
  history: [],
  variables: {},
  state: {}
}

await importTemplate("template.prompty", {
  ...data,
  context
})
```

### 3. Custom Functions
```javascript
// Define custom template functions
script({
  prompty: {
    functions: {
      formatDate: (date) => date.toISOString(),
      capitalize: (str) => str.toUpperCase()
    }
  }
})
```

## Example Use Cases

### 1. Chatbot Flow
```yaml
# chat.prompty
---
name: chat_flow
---
system:
  You are a helpful chatbot.

user:
  {{message}}

assistant:
  Let me process that.
  {{process_message}}

function process_message:
  Return a friendly response to {{message}}.
```

### 2. Data Analysis
```yaml
# analysis.prompty
---
name: data_analysis
---
system:
  You are a data analyst.

user:
  Analyze this data:
  {{data}}

assistant:
  Here's my analysis:
  {{analyze}}

function analyze:
  Perform statistical analysis on {{data}}.
```

### 3. Code Generation
```yaml
# codegen.prompty
---
name: code_generation
---
system:
  You are a code generator.

user:
  Generate {{language}} code for:
  {{specification}}

assistant:
  Here's the implementation:
  {{generate_code}}

function generate_code:
  Write clean, documented {{language}} code.
```

## Best Practices

### 1. Template Organization
```
prompts/
  ├── system/
  │   ├── base.prompty
  │   └── common.prompty
  ├── flows/
  │   ├── chat.prompty
  │   └── analysis.prompty
  └── utils/
      ├── format.prompty
      └── validate.prompty
```

### 2. Variable Management
```yaml
# Variables in prompty files
---
name: template
variables:
  - name: userId
    type: string
    required: true
  - name: context
    type: object
    default: {}
---
system:
  Process request for user {{userId}}.
```

### 3. Error Handling
```javascript
// Handle template errors
try {
  await importTemplate("template.prompty", data)
} catch (error) {
  if (error.type === "template") {
    // Handle template errors
  } else if (error.type === "variable") {
    // Handle missing/invalid variables
  }
}
```

## Advanced Patterns

### 1. Multi-Step Processing
```yaml
# process.prompty
---
name: multi_step
steps:
  - name: prepare
    template: prepare.prompty
  - name: process
    template: process.prompty
  - name: validate
    template: validate.prompty
---
system:
  Process in steps.
```

### 2. Feedback Loops
```yaml
# feedback.prompty
---
name: feedback_loop
---
system:
  Improve responses through feedback.

user:
  {{input}}
  Previous feedback: {{feedback}}

assistant:
  Let me adjust based on feedback.
```

### 3. Dynamic Templates
```javascript
// Generate templates dynamically
const template = generateTemplate({
  steps: ['analyze', 'process', 'respond'],
  context: data
})

await importTemplate(template, data)
```

## Integration Examples

### 1. API Endpoints
```javascript
// Express.js integration
app.post('/chat', async (req, res) => {
  const result = await importTemplate("chat.prompty", {
    message: req.body.message,
    userId: req.user.id
  })
  
  res.json(result)
})
```

### 2. Batch Processing
```javascript
// Process multiple items
async function batchProcess(items) {
  const template = await loadTemplate("process.prompty")
  
  for (const item of items) {
    await importTemplate(template, {
      item,
      context: { batch: true }
    })
  }
}
```

### 3. Web Applications
```javascript
// React component integration
function ChatComponent() {
  const [messages, setMessages] = useState([])
  
  async function handleMessage(text) {
    const response = await importTemplate("chat.prompty", {
      message: text,
      history: messages
    })
    
    setMessages([...messages, response])
  }
}
```

## Testing

### 1. Template Testing
```javascript
// Test template outputs
test("template test", async () => {
  const result = await importTemplate("template.prompty", {
    input: "test"
  })
  
  assert.match(result, expectedPattern)
})
```

### 2. Chain Testing
```javascript
// Test prompt chains
test("chain test", async () => {
  const results = await testChain([
    "step1.prompty",
    "step2.prompty"
  ], testData)
  
  assert.chainComplete(results)
})
```

## Additional Resources

- [Prompty Documentation](https://prompty.ai/)
- [Template Examples](https://microsoft.github.io/genaiscript/reference/scripts/prompty/)
- [Best Practices](https://microsoft.github.io/genaiscript/guides/prompt-as-code/)
- [API Reference](https://microsoft.github.io/genaiscript/reference/scripts/import-template/)
