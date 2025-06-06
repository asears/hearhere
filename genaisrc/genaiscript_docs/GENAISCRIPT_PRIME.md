# GenAIScript Priming & Response Formatting

## Overview

Priming and grounding are essential techniques for ensuring LLMs provide accurate, relevant, and well-formatted responses. This document covers best practices for priming LLMs, controlling response formats, and maintaining conversation context.

## Priming Techniques

### System Messages

1. Basic System Message
```javascript
script({
  system: "You are a helpful AI assistant focused on technical documentation."
})
```

2. Multi-Role System Message
```javascript
script({
  system: [
    "You are an expert in software architecture",
    "You prioritize security best practices",
    "You provide concise, actionable advice"
  ]
})
```

### Context Setting

1. Environment Definition
```javascript
script({
  context: {
    project: "E-commerce Platform",
    language: "TypeScript",
    framework: "Next.js"
  }
})
```

2. Domain Expertise
```javascript
script({
  domain: {
    industry: "Healthcare",
    compliance: ["HIPAA", "GDPR"],
    security: "high"
  }
})
```

## Response Formatting

### Output Templates

1. JSON Structure
```javascript
const schema = defSchema("RESPONSE", {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    points: { 
      type: "array",
      items: { type: "string" }
    }
  }
})

$\`Analyze the document and provide a response matching ${schema}\`
```

2. Markdown Format
```javascript
script({
  format: "markdown",
  template: `
# {{title}}

## Summary
{{summary}}

## Key Points
{{#each points}}
- {{this}}
{{/each}}
  `
})
```

### Response Validation

1. Schema Validation
```javascript
const validator = defValidator({
  validate: (response) => {
    return {
      isValid: response.length > 0,
      repair: response || "No response generated"
    }
  }
})
```

2. Content Safety
```javascript
script({
  validation: {
    safety: true,
    profanity: "block",
    pii: "redact"
  }
})
```

## Conversation Control

### Memory Management

1. Short-term Memory
```javascript
script({
  memory: {
    type: "short",
    maxTurns: 5
  }
})
```

2. Long-term Memory
```javascript
script({
  memory: {
    type: "vector",
    store: "azure_ai_search"
  }
})
```

### Context Windows

1. Token Management
```javascript
script({
  context: {
    maxTokens: 2000,
    preserveRatio: 0.7 // 70% context, 30% response
  }
})
```

2. Priority Context
```javascript
script({
  context: {
    priority: ["system", "recent", "relevant"],
    weightDecay: 0.8
  }
})
```

## Specialized Priming

### API Documentation

```javascript
script({
  system: "You are an API documentation expert",
  rules: [
    "Use OpenAPI 3.0 format",
    "Include request/response examples",
    "Document all status codes",
    "Note rate limits and authentication"
  ]
})
```

### Code Review

```javascript
script({
  system: "You are a senior code reviewer",
  focus: [
    "Security vulnerabilities",
    "Performance optimizations",
    "Best practices",
    "Code style"
  ],
  output: {
    format: "github-pr-review"
  }
})
```

### Financial Analysis

```javascript
script({
  system: "You are a financial analyst assistant",
  compliance: {
    regulations: ["SEC", "FINRA"],
    disclaimers: true
  },
  precision: {
    numbers: 2,
    dates: "YYYY-MM-DD"
  }
})
```

## Best Practices

### 1. Clear Instructions

- Be specific about expected output
- Define format requirements
- Specify any constraints
- Include examples when helpful

### 2. Context Management

- Prioritize relevant information
- Remove unnecessary context
- Use appropriate window sizes
- Implement memory strategies

### 3. Validation

- Define expected schemas
- Implement content safety
- Validate outputs
- Handle edge cases

### 4. Performance

- Optimize prompt length
- Use efficient memory storage
- Implement caching
- Batch similar requests

## Error Handling

### 1. Response Validation

```javascript
try {
  const response = await $\`Generate analysis\`
  const valid = await validateResponse(response)
  if (!valid) {
    await repairResponse(response)
  }
} catch (e) {
  handleError(e)
}
```

### 2. Fallback Strategies

```javascript
script({
  fallback: {
    invalidResponse: "Please provide a valid response",
    timeout: "Request timed out, please try again",
    error: "An error occurred: {error}"
  }
})
```

## Examples

### 1. Technical Documentation

```javascript
script({
  system: "Technical documentation assistant",
  template: `
## API Endpoint: {{name}}

**Description**: {{description}}

### Request
\`\`\`json
{{request}}
\`\`\`

### Response
\`\`\`json
{{response}}
\`\`\`

### Status Codes
{{#each statusCodes}}
- {{code}}: {{description}}
{{/each}}
  `
})
```

### 2. Data Analysis

```javascript
script({
  system: "Data analysis assistant",
  rules: [
    "Always include statistical significance",
    "Provide confidence intervals",
    "Note data limitations",
    "Include visualization suggestions"
  ],
  format: {
    numbers: {
      precision: 2,
      notation: "standard"
    },
    dates: "ISO"
  }
})
```

### 3. Security Review

```javascript
script({
  system: "Security review assistant",
  framework: "OWASP Top 10",
  output: {
    sections: [
      "Vulnerabilities",
      "Risk Levels",
      "Recommendations",
      "References"
    ],
    format: "markdown"
  }
})
```

## References

- [Response Formatting](https://microsoft.github.io/genaiscript/reference/scripts/output-builder/)
- [Schema Validation](https://microsoft.github.io/genaiscript/reference/scripts/schemas/)
- [Memory Management](https://microsoft.github.io/genaiscript/reference/scripts/memory/)
- [System Prompts](https://microsoft.github.io/genaiscript/reference/scripts/system/)
