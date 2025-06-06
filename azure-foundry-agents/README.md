# Azure AI Foundry Agent Service Documentation

Azure AI Foundry Agent Service is a comprehensive platform for building, deploying, and managing intelligent agents in production environments. It combines models, tools, frameworks, and governance into a unified system that ensures security, scalability, and reliability.

## Overview

AI Foundry Agent Service acts as the central hub that connects core components of Azure AI Foundry:

- Models
- Tools
- Frameworks
- Infrastructure

The service manages:
- Thread orchestration
- Tool invocations
- Content safety
- Identity integration
- Network security
- Observability

## Key Components

### 1. Models (LLM)
- Powers reasoning and language understanding
- Supports multiple model types:
  - Azure OpenAI models (GPT-4o, GPT-4, GPT-3.5)
  - Non-Microsoft models (e.g., Meta-Llama)
  - Custom models through Azure AI Foundry

### 2. Instructions
- Define agent goals
- Set behavioral boundaries
- Establish constraints

### 3. Tools
- Enable knowledge retrieval
- Facilitate actions
- Integrate with enterprise systems:
  - Bing Search
  - SharePoint
  - Azure AI Search
  - Logic Apps
  - Azure Functions
  - OpenAPI services

## Documentation Structure

- [Setup Guide](setup-guide.md) - Detailed environment setup instructions
- [Architecture Overview](architecture.md) - System design and components
- [Model Support Matrix](model-support.md) - Available models and regional support
- [Enterprise Features](enterprise-features.md) - Security, governance, and monitoring
- [Getting Started](getting-started.md) - Quick start guide and tutorials

## Prerequisites

- Azure subscription
- Required roles:
  - Azure AI Account Owner
  - Role Based Access Administrator (for Standard Setup)
  - Azure AI User

For more detailed information, visit the [official Azure AI Foundry Agent Service documentation](https://learn.microsoft.com/azure/ai-services/agents/).
