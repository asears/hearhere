# GenAIScript Red Team Guide

## Overview

Red teaming is essential for identifying and mitigating security risks in LLM applications. This guide covers security testing practices, OWASP compliance, and secure LLM code implementation using GenAIScript.

## OWASP LLM Top 10 Testing

### 1. Prompt Injection (LLM01)
```javascript
// Test direct prompt injection
script({
  redteam: {
    plugins: ["owasp:llm:01"],
    strategies: ["prompt-injection", "jailbreak"]
  }
})
```

### 2. Information Disclosure (LLM02)
```javascript
// Test for PII and sensitive data leaks
script({
  redteam: {
    plugins: [
      "pii:direct",
      "pii:session",
      "pii:social",
      "pii:api-db"
    ]
  }
})
```

### 3. Training Data Poisoning (LLM04)
```javascript
// Test for model poisoning effects
script({
  redteam: {
    plugins: [
      "harmful",
      "overreliance",
      "hallucination"
    ]
  }
})
```

### 4. Output Manipulation (LLM05)
```javascript
// Test output validation
script({
  assert: {
    type: "not-contains",
    value: "<script>"
  }
})
```

### 5. Excessive Agency (LLM06)
```javascript
// Test for unauthorized actions
script({
  redteam: {
    plugins: [
      "excessive-agency",
      "overreliance",
      "imitation",
      "hijacking",
      "rbac"
    ]
  }
})
```

### 6. Prompt Leakage (LLM07)
```javascript
// Test system prompt extraction
script({
  redteam: {
    plugins: [{
      id: "prompt-extraction",
      config: {
        systemPrompt: "Your system prompt here"
      }
    }]
  }
})
```

### 7. RAG Vulnerabilities (LLM08)
```javascript
// Test RAG security
script({
  redteam: {
    plugins: [
      "rbac",  // Role-Based Access Control
      "bola",  // Broken Object-Level Auth
      "bfla"   // Broken Function-Level Auth
    ]
  }
})
```

### 8. Indirect Prompt Injection
```javascript
// Test context-based injection
script({
  redteam: {
    plugins: [{
      id: "indirect-prompt-injection",
      config: {
        indirectInjectionVar: "name"
      }
    }]
  }
})
```

### 9. Misinformation (LLM09)
```javascript
// Test for hallucination/misinformation
script({
  redteam: {
    plugins: [
      "overreliance",
      "hallucination"
    ]
  }
})
```

### 10. Unbounded Consumption (LLM10)
```javascript
// Test resource limits
script({
  redteam: {
    plugins: ["divergent-repetition"]
  }
})
```

## OWASP Gen AI Red Team Phases

### Phase 1: Model Evaluation
```javascript
script({
  redteam: {
    plugins: ["owasp:llm:redteam:model"]
  }
})
```

### Phase 2: Implementation Evaluation
```javascript
script({
  redteam: {
    plugins: ["owasp:llm:redteam:implementation"]
  }
})
```

### Phase 3: System Evaluation
```javascript
script({
  redteam: {
    plugins: ["owasp:llm:redteam:system"]
  }
})
```

### Phase 4: Runtime Evaluation
```javascript
script({
  redteam: {
    plugins: ["owasp:llm:redteam:runtime"]
  }
})
```

## Security Best Practices

### 1. Content Safety
```javascript
// Enable content safety checks
script({
  systemSafety: "default",
  contentSafety: "azure"
})

// Check content
const safety = await host.contentSafety()
const result = await safety.check(content)
```

### 2. Secret Scanning
```javascript
// Configure secret patterns
// genaiscript.config.json
{
  "secretPatterns": {
    "API Key": "api_key_[0-9a-zA-Z]{32}",
    "OpenAI API Key": "sk-[A-Za-z0-9]{32,48}"
  }
}

// Scan for secrets
const scanner = await host.secretScanner()
await scanner.scan(input)
```

### 3. Access Control
```javascript
// Implement RBAC
script({
  redteam: {
    plugins: ["rbac"]
  }
})

// Test authorization
const auth = await validateAuth(user, action)
```

### 4. Input Validation
```javascript
// Define input schema
const schema = defSchema("INPUT", {
  type: "object",
  required: ["query"],
  properties: {
    query: { type: "string", maxLength: 1000 }
  }
})

// Validate input
const isValid = await validate(input, schema)
```

### 5. Output Sanitization
```javascript
// Define output schema
const schema = defSchema("OUTPUT", {
  type: "object",
  properties: {
    text: { type: "string" }
  }
})

// Validate output
const output = await sanitize(result, schema)
```

## Testing Framework

### Unit Tests
```javascript
// Test security measures
test("security test", async () => {
  // Setup test data
  def("INPUT", "malicious input")
  
  // Run security checks
  const result = await runSecurityChecks()
  
  // Assert results
  assert.equal(result.safe, true)
})
```

### Integration Tests
```javascript
// Test complete flow
test("integration test", async () => {
  // Setup test environment
  const context = await setupTestEnv()
  
  // Run tests
  const result = await runIntegrationTests(context)
  
  // Verify security
  assert.noSecurityIssues(result)
})
```

### Continuous Monitoring
```javascript
// Monitor for security events
script({
  monitoring: {
    security: true,
    events: ["injection", "leakage", "abuse"]
  }
})
```

## Azure Integration

### Azure Content Safety
```javascript
// Configure Azure Content Safety
script({
  contentSafety: {
    provider: "azure",
    config: {
      endpoint: process.env.AZURE_CONTENT_SAFETY_ENDPOINT,
      key: process.env.AZURE_CONTENT_SAFETY_KEY
    }
  }
})
```

### Azure OpenAI Security
```javascript
// Secure Azure OpenAI configuration
script({
  model: "azure:deployment-id",
  security: {
    contentFilters: true,
    rateLimit: true,
    tokenLimit: 1000
  }
})
```

## Best Practices Implementation

1. **Input Protection**
   - Validate all inputs
   - Sanitize user data
   - Implement rate limiting
   - Use strict schemas

2. **Output Control**
   - Validate outputs
   - Implement content filtering
   - Check for sensitive data
   - Apply safety measures

3. **Authentication & Authorization**
   - Implement role-based access
   - Use secure tokens
   - Validate permissions
   - Monitor access patterns

4. **Monitoring & Logging**
   - Track security events
   - Monitor resource usage
   - Log suspicious activity
   - Generate alerts

5. **Error Handling**
   - Handle errors gracefully
   - Don't expose sensitive info
   - Log security failures
   - Implement fallbacks

## Additional Resources

- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [GenAIScript Security Docs](https://microsoft.github.io/genaiscript/reference/security-and-trust/)
- [Azure AI Security](https://learn.microsoft.com/en-us/azure/ai-services/openai/security-features)
- [PromptFoo Docs](https://www.promptfoo.dev/docs/red-team/)
