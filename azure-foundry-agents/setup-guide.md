# Setup Guide

This guide provides detailed instructions for setting up Azure AI Foundry Agent Service in your environment.

## Prerequisites

- Azure subscription ([Create one for free](https://azure.microsoft.com/free/cognitive-services))
- Required permissions:
  - Azure AI Account Owner (subscription scope)
  - Role Based Access Administrator (for Standard Setup)
  - Azure AI User (for agent management)

## Environment Configuration Options

### 1. Basic Setup

Ideal for:
- Quick prototyping
- Simple deployments
- OpenAI Assistants compatibility

Features:
- Platform-managed storage
- Basic tools and capabilities
- Azure AI Search and Bing integration

### 2. Standard Setup

Ideal for:
- Production deployments
- Data ownership requirements
- Compliance needs

Features:
- Custom Azure resource usage
- Full data control
- Customer-managed keys support
- Enhanced security options

### 3. BYO Virtual Network

Ideal for:
- High-security environments
- Data sovereignty requirements
- Network isolation needs

Features:
- Complete network isolation
- Traffic confinement
- Data exfiltration prevention
- Custom network security

## Setup Comparison

| Feature | Basic | Standard | BYO VNet |
|---------|-------|----------|----------|
| Quick Start | ✅ | ❌ | ❌ |
| Custom Resource Storage | ❌ | ✅ | ✅ |
| Customer Managed Keys | ❌ | ✅ | ✅ |
| Network Isolation | ❌ | ❌ | ✅ |

## Setup Steps

### Basic Setup

1. **Create Azure AI Account**
   ```powershell
   az group create --name myResourceGroup --location eastus
   az cognitiveservices account create --name myAIAccount --resource-group myResourceGroup --kind AIServices --sku S0 --location eastus
   ```

2. **Create Project**
   - Navigate to Azure AI Studio
   - Select "Create Project"
   - Choose "Basic Setup"
   - Follow the guided setup

3. **Deploy Model**
   - Select model from catalog
   - Choose deployment region
   - Configure compute resources

### Standard Setup

1. **Prepare Resources**
   - Create Azure Storage Account
   - Create Cosmos DB instance
   - Set up Azure AI Search

2. **Create Project**
   - Choose "Standard Setup"
   - Link existing resources
   - Configure security settings

3. **Configure Access**
   - Set up RBAC
   - Configure managed identities
   - Establish resource connections

### BYO Virtual Network Setup

1. **Network Preparation**
   - Create/configure VNet
   - Set up subnets
   - Configure network security

2. **Resource Configuration**
   - Deploy resources in VNet
   - Configure private endpoints
   - Set up DNS resolution

3. **Security Setup**
   - Configure network policies
   - Set up firewall rules
   - Establish access controls

## Model Configuration

Default Template Parameters:
- Model Name: gpt-4o
- Model Format: OpenAI
- Model Version: 2024-11-20
- Model SKU: GlobalStandard
- Model Location: eastus

Customizing the Model:
1. Edit deployment template
2. Update parameters:
   - modelName
   - modelVersion
   - modelSkuName
   - modelLocation

> Note: Only Azure OpenAI models are supported in the deployment templates.

## Next Steps

1. **Create Your First Agent**
   - Use SDK or Portal
   - Configure basic settings
   - Test functionality

2. **Configure Tools**
   - Set up integrations
   - Configure permissions
   - Test connections

3. **Enable Monitoring**
   - Set up logging
   - Configure metrics
   - Establish alerts

## Troubleshooting

Common Issues:
1. **Permission Errors**
   - Verify role assignments
   - Check subscription access
   - Validate resource permissions

2. **Network Issues**
   - Check VNet configuration
   - Verify DNS resolution
   - Test connectivity

3. **Resource Deployment**
   - Validate quotas
   - Check region availability
   - Verify resource dependencies

## Additional Resources

- [Official Documentation](https://learn.microsoft.com/azure/ai-services/agents/)
- [AI Fundamentals Training](https://learn.microsoft.com/training/modules/ai-agent-fundamentals/)
- [Azure AI Certification](https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/)
