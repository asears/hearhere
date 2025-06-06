# Model Support Matrix

This document provides detailed information about the models supported by Azure AI Foundry Agent Service, including their availability by region and deployment type.

## Azure OpenAI Models

Azure OpenAI provides two main deployment types:

1. **Standard Deployment**
   - Global traffic routing
   - Higher throughput
   - Pay-as-you-go pricing

2. **Provisioned Deployment**
   - Global deployment option
   - Dedicated throughput units
   - Reserved capacity

### Regional Availability

Below is the availability matrix for standard deployments across Azure regions:

| Region | GPT-4o | GPT-4o-mini | GPT-4 | GPT-3.5-Turbo |
|--------|--------|-------------|-------|----------------|
| Australia East | ✅ | ✅ | ✅ | ✅ |
| Canada East | ✅ | ✅ | ✅ | ✅ |
| East US | ✅ | ✅ | ✅ | ✅ |
| East US 2 | ✅ | ✅ | ✅ | ✅ |
| France Central | ✅ | ✅ | ✅ | ✅ |
| Japan East | ✅ | ❌ | ❌ | ✅ |
| Sweden Central | ✅ | ✅ | ✅ | ✅ |
| Switzerland North | ✅ | ✅ | ❌ | ✅ |
| UK South | ✅ | ❌ | ✅ | ✅ |
| West US | ✅ | ✅ | ✅ | ❌ |
| West US 3 | ✅ | ✅ | ❌ | ❌ |

> Note: For Provisioned Throughput Unit (PTU) availability, refer to the [Azure OpenAI documentation](https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput).

## Non-Microsoft Models

Azure AI Foundry Agent Service supports models from the Azure AI Foundry model catalog, including:

- Meta-Llama-405B-Instruct
- Other open-source models (e.g., Cepstral, Mistral, Llama)

### Integration Method

```python
agent = project_client.agents.create_agent(
    model="llama-3",
    name="my-agent",
    instructions="You are a helpful agent"
)
```

## Tool-Calling Support

### Models with Tool-Calling

Recommended for agentic scenarios:
- All Azure OpenAI models
- Supported open-source models from Azure AI Foundry catalog

Integration Example:
```python
agent = project_client.agents.create_agent(
    model="llama-3",
    name="my-agent",
    instructions="You are a helpful agent"
)
```

### Models without Tool-Calling

For use cases not requiring tool interaction:

1. **Setup Steps**
   - Deploy model through serverless API
   - Locate model in Models + Endpoints page
   - Get model's target URI and key
   - Create Serverless connection

2. **Usage Example**
```python
Model="https://Phi-4-mejco.eastus.models.ai.azure.com/@Phi-4-mejco"
```

## Model Selection Guidelines

### 1. Use Case Considerations

- **Basic Chat/Completion**
  - GPT-3.5-Turbo
  - Non-tool-calling models

- **Complex Reasoning**
  - GPT-4o
  - GPT-4

- **Tool Integration**
  - Tool-calling enabled models
  - Azure OpenAI models

### 2. Performance Factors

- Model capabilities
- Regional availability
- Latency requirements
- Cost considerations

### 3. Deployment Type Selection

- **Standard Deployment**
  - Variable workloads
  - Cost optimization
  - Global availability

- **Provisioned Deployment**
  - Consistent workloads
  - Performance requirements
  - Dedicated capacity

## Best Practices

1. **Model Selection**
   - Choose models based on capability requirements
   - Consider regional availability
   - Evaluate performance vs. cost
   - Test with representative workloads

2. **Deployment**
   - Use appropriate deployment type
   - Monitor usage patterns
   - Implement proper error handling
   - Set up monitoring and alerts

3. **Performance**
   - Choose closest region
   - Use appropriate model size
   - Implement caching where possible
   - Monitor latency and throughput

4. **Cost Management**
   - Monitor usage
   - Use appropriate deployment type
   - Implement quotas
   - Regular cost analysis

## Model Updates

Keep track of:
- New model releases
- Version updates
- Regional expansion
- Feature additions

Visit the [Azure AI Foundry documentation](https://learn.microsoft.com/azure/ai-services/agents/) for the latest updates.
