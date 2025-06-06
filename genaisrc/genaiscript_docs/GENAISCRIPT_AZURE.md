# GenAIScript Azure Integration Guide

## Overview

GenAIScript provides deep integration with Azure services, particularly for AI and ML workloads. This guide covers configuration, usage patterns, and best practices for Azure integration.

## Azure Service Integration

### 1. Azure OpenAI
```javascript
// Configure Azure OpenAI
script({
  model: "azure:deployment-id",
  // Configuration
})

// Environment setup
// .env
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_ENDPOINT=https://....openai.azure.com
AZURE_OPENAI_API_VERSION=2025-01-01-preview
```

### 2. Azure AI Foundry
```javascript
// Direct model access
script({
  model: "azure_ai_inference:model-id"
})

// Serverless deployment
script({
  model: "azure_serverless:deployment-id"
})

// Non-OpenAI models
script({
  model: "azure_serverless_models:deployment-id"
})
```

### 3. Azure AI Search
```javascript
// Configure vector search
const index = await retrieval.index("name", {
  type: "azure_ai_search"
})

// Index operations
await index.insertOrUpdate(documents)
const results = await index.search("query")
```

## Authentication Methods

### 1. Managed Identity (Recommended)
```javascript
// .env
AZURE_OPENAI_API_ENDPOINT=https://....openai.azure.com
NODE_ENV=development  // For DefaultAzureCredential

// Remove any API key entries
// AZURE_OPENAI_API_KEY should not be present
```

### 2. API Key
```javascript
// .env
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_ENDPOINT=https://....openai.azure.com
```

### 3. Custom Credentials
```javascript
// .env
AZURE_OPENAI_API_CREDENTIALS=cli  // or env, powershell, devcli
AZURE_OPENAI_TOKEN_SCOPES=...     // Custom token scopes
```

## Model Management

### 1. Model Aliases
```javascript
// Default aliases
{
  "large": "gpt-4o",
  "small": "gpt-4o-mini",
  "vision": "gpt-4o",
  "vision_small": "gpt-4o-mini",
  "reasoning": "o1",
  "reasoning_small": "o1-mini",
  "embeddings": "text-embedding-3-small"
}

// Custom aliases
// .env
GENAISCRIPT_MODEL_LARGE=azure:deployment-large
GENAISCRIPT_MODEL_SMALL=azure:deployment-small
```

### 2. Model Deployment
```javascript
// List available models
script({
  async init() {
    const models = await listModels("azure")
    console.log(models)
  }
})

// Custom endpoint
// .env
AZURE_OPENAI_API_MODELS_TYPE=openai
```

### 3. Version Control
```javascript
// Specify API version
// .env
AZURE_OPENAI_API_VERSION=2025-01-01-preview

// Per-deployment version
AZURE_OPENAI_API_VERSION_GPT4O=2025-01-01-preview
```

## Content Safety

### 1. Azure Content Safety
```javascript
// Enable content safety
script({
  contentSafety: "azure",
  // Config
})

// Check content
const safety = await host.contentSafety()
const result = await safety.check(content)
```

### 2. System Safety
```javascript
// Enable system safety
script({
  systemSafety: "default"
})
```

## Resource Management

### 1. Rate Limiting
```javascript
// Configure rate limits
script({
  rateLimit: {
    requestsPerMinute: 60,
    tokensPerMinute: 4000
  }
})
```

### 2. Quota Management
```javascript
// Monitor quota
const usage = await getQuota()
if (usage.remaining < threshold) {
  // Handle quota limits
}
```

### 3. Cost Management
```javascript
// Track costs
script({
  monitoring: {
    costs: true
  }
})
```

## Security Features

### 1. Network Security
```javascript
// Configure private endpoints
// Azure portal configuration required

// Use custom domain
AZURE_OPENAI_API_ENDPOINT=https://custom.domain.com
```

### 2. Access Control
```javascript
// Role assignments
// Cognitive Services OpenAI User
// Azure AI Developer
// Required IAM setup in Azure portal
```

### 3. Audit Logging
```javascript
// Enable diagnostic logs
script({
  logging: {
    diagnostics: true,
    level: "verbose"
  }
})
```

## Azure Functions Integration

### 1. HTTP Trigger
```javascript
module.exports = async function (context, req) {
  const result = await script({
    model: "azure:deployment-id",
    // Config
  })
  
  context.res = {
    body: result
  }
}
```

### 2. Timer Trigger
```javascript
module.exports = async function (context, myTimer) {
  await script({
    schedule: "0 */5 * * * *",
    // Config
  })
}
```

## Best Practices

1. **Authentication**
   - Use managed identities when possible
   - Rotate API keys regularly
   - Implement least privilege access
   - Monitor authentication failures

2. **Resource Management**
   - Implement rate limiting
   - Monitor quotas and usage
   - Set up cost alerts
   - Use resource tags

3. **Security**
   - Enable content safety
   - Implement network security
   - Configure audit logging
   - Regular security reviews

4. **Performance**
   - Use appropriate model versions
   - Optimize prompt size
   - Cache responses
   - Monitor latency

5. **Monitoring**
   - Set up diagnostics
   - Configure alerts
   - Track metrics
   - Regular audits

## Troubleshooting

### 1. Authentication Issues
```javascript
// Test authentication
const auth = await testAuth({
  provider: "azure",
  resource: "openai"
})

// Check credentials
if (!auth.success) {
  console.error(auth.error)
}
```

### 2. Deployment Issues
```javascript
// Verify deployment
const deployment = await checkDeployment({
  type: "azure_openai",
  id: "deployment-id"
})

// Handle errors
if (!deployment.active) {
  // Handle deployment issues
}
```

### 3. Performance Issues
```javascript
// Monitor performance
script({
  monitoring: {
    performance: true,
    metrics: ["latency", "tokens", "errors"]
  }
})
```

## Azure Services Map

1. **AI Services**
   - Azure OpenAI
   - Azure AI Foundry
   - Azure Machine Learning
   - Azure Cognitive Services

2. **Data Services**
   - Azure AI Search
   - Azure Cosmos DB
   - Azure Storage
   - Azure Cache for Redis

3. **Security Services**
   - Azure Key Vault
   - Azure Active Directory
   - Azure Private Link
   - Azure Monitor

4. **Deployment Services**
   - Azure Functions
   - Azure App Service
   - Azure Container Apps
   - Azure Kubernetes Service

## Additional Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Azure AI Foundry](https://microsoft.github.io/genaiscript/configuration/azure-ai-foundry/)
- [Azure AI Studio](https://ai.azure.com/)
- [Azure Security Best Practices](https://learn.microsoft.com/en-us/azure/security/fundamentals/best-practices-and-patterns)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
