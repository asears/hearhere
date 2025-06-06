# Getting Started

This guide will help you quickly set up and deploy your first agent using Azure AI Foundry Agent Service.

## Prerequisites

1. **Azure Account**
   - Active subscription
   - Required permissions
   - Access to Azure portal

2. **Required Roles**
   - Azure AI Account Owner
   - Role Based Access Administrator (for Standard setup)
   - Azure AI User

## Quick Start Steps

### 1. Create an Azure AI Foundry Project

```powershell
# Create resource group
az group create --name myAgentGroup --location eastus

# Create AI Services account
az cognitiveservices account create \
    --name myAIAccount \
    --resource-group myAgentGroup \
    --kind AIServices \
    --sku S0 \
    --location eastus
```

### 2. Deploy a Model

1. Navigate to Azure AI Studio
2. Select your project
3. Choose "Deploy Model"
4. Select GPT-4o (recommended for starters)
5. Configure deployment settings

### 3. Create Your First Agent

```python
from azure.ai.agent import AgentClient

# Initialize client
client = AgentClient(
    subscription_id="your_subscription_id",
    resource_group="myAgentGroup",
    account_name="myAIAccount"
)

# Create agent
agent = client.agents.create_agent(
    name="my-first-agent",
    model="gpt-4o",
    instructions="You are a helpful agent that answers questions about Azure services."
)
```

### 4. Add Tools

```python
# Add Azure AI Search tool
search_tool = {
    "type": "azure-search",
    "properties": {
        "endpoint": "your_search_endpoint",
        "key": "your_search_key",
        "index": "your_index_name"
    }
}

agent.add_tool(search_tool)
```

## Basic Operations

### 1. Send Messages

```python
# Start a conversation
thread = client.threads.create()

# Send a message
message = client.messages.create(
    thread_id=thread.id,
    role="user",
    content="What Azure services are available in East US?"
)

# Get response
response = client.messages.get(
    thread_id=thread.id,
    message_id=message.id
)
```

### 2. Use Tools

```python
# Example of using Azure AI Search tool
response = agent.invoke(
    "Please search for documentation about Azure Virtual Machines.",
    tools=["azure-search"]
)
```

### 3. Monitor Activity

```python
# Get thread history
history = client.threads.list_messages(thread_id=thread.id)

# Get tool execution logs
logs = client.threads.list_tool_executions(thread_id=thread.id)
```

## Common Use Cases

### 1. Question Answering

```python
agent = client.agents.create_agent(
    name="qa-agent",
    model="gpt-4o",
    instructions="""
    You are a helpful agent that answers questions about Azure services.
    Use the provided documentation to give accurate answers.
    If you're unsure, say so.
    """,
    tools=["azure-search"]
)
```

### 2. Task Automation

```python
agent = client.agents.create_agent(
    name="automation-agent",
    model="gpt-4o",
    instructions="""
    You help automate Azure resource management tasks.
    Use Azure CLI commands when applicable.
    Verify actions before executing.
    """,
    tools=["azure-cli", "azure-rest-api"]
)
```

### 3. Data Analysis

```python
agent = client.agents.create_agent(
    name="analysis-agent",
    model="gpt-4o",
    instructions="""
    You analyze Azure resource metrics and logs.
    Provide insights and recommendations.
    Use visualization when helpful.
    """,
    tools=["azure-monitor", "azure-insights"]
)
```

## Best Practices

### 1. Agent Design

- Write clear, specific instructions
- Start with simple tasks
- Gradually add complexity
- Test thoroughly

### 2. Tool Integration

- Start with essential tools
- Test tool connections
- Handle errors gracefully
- Monitor tool usage

### 3. Security

- Use managed identities
- Implement least privilege
- Enable content filtering
- Monitor activity

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```
   Solution: Verify credentials and permissions
   ```

2. **Tool Connection Issues**
   ```
   Solution: Check endpoints and keys
   ```

3. **Model Errors**
   ```
   Solution: Verify model availability in your region
   ```

### Getting Help

- [Documentation](https://learn.microsoft.com/azure/ai-services/agents/)
- [Azure Support](https://azure.microsoft.com/support/options/)
- [Community Forums](https://learn.microsoft.com/answers/tags/441/ai-services/)

## Next Steps

1. **Explore Advanced Features**
   - Multi-agent coordination
   - Custom tool development
   - Advanced monitoring

2. **Optimize Performance**
   - Fine-tune models
   - Optimize tool usage
   - Implement caching

3. **Scale Your Solution**
   - Add more agents
   - Implement workflows
   - Set up monitoring

For more detailed information, refer to the other documentation sections:
- [Architecture Overview](architecture.md)
- [Setup Guide](setup-guide.md)
- [Model Support](model-support.md)
- [Enterprise Features](enterprise-features.md)
