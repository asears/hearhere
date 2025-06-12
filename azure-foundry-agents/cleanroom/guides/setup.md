# Setting Up Azure Confidential Clean Rooms

This guide provides step-by-step instructions for setting up Azure Confidential Clean Rooms for AI Foundry integration.

## Prerequisites

- Azure subscription with confidential computing access
- Azure CLI with confcom extension installed
- Contributor access to target resource groups
- Managed identity configuration capabilities

## Setup Steps

### 1. Environment Preparation

```powershell
# Install Azure CLI extension for confidential computing
az extension add --name confcom

# Set up resource group
az group create --name rg-cleanroom-dev --location eastus

# Enable attestation provider (if not exists)
az attestation provider create --name "cleanroomAttestation" --resource-group "rg-cleanroom-dev" --location "eastus"
```

### 2. Container Registry Setup

```powershell
# Create Azure Container Registry
az acr create --resource-group rg-cleanroom-dev \
    --name acrcleanroomdev \
    --sku Premium \
    --enable-admin false

# Enable encryption
az acr encryption set \
    --name acrcleanroomdev \
    --resource-group rg-cleanroom-dev \
    --identity-client-id <managed-identity-client-id>
```

### 3. Key Vault Configuration

```powershell
# Create Key Vault
az keyvault create --name kv-cleanroom-dev \
    --resource-group rg-cleanroom-dev \
    --location eastus \
    --enable-rbac-authorization true

# Configure purge protection and soft-delete
az keyvault update --name kv-cleanroom-dev \
    --enable-purge-protection true \
    --retention-days 90
```

### 4. Storage Account Setup

```powershell
# Create storage account for encrypted files
az storage account create \
    --name stacleanroomdev \
    --resource-group rg-cleanroom-dev \
    --location eastus \
    --sku Standard_LRS \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault kv-cleanroom-dev \
    --encryption-key-name cleanroom-key
```

## Clean Room Environment Configuration

### 1. Create Confidential Container Group

Use the included Bicep templates in the `/bicep` directory for consistent deployment:

```powershell
# Deploy using Bicep
az deployment group create \
    --resource-group rg-cleanroom-dev \
    --template-file ./bicep/main.bicep \
    --parameters ./bicep/main.parameters.json
```

### 2. Configure Multi-party Access

```powershell
# Grant access to collaborators
az role assignment create \
    --role "Clean Room Contributor" \
    --assignee-object-id <collaborator-object-id> \
    --scope /subscriptions/<subscription-id>/resourceGroups/rg-cleanroom-dev
```

### 3. Setup Audit Logging

```powershell
# Enable diagnostic settings
az monitor diagnostic-settings create \
    --name "cleanroom-audit" \
    --resource <cleanroom-resource-id> \
    --logs '[{"category": "AuditEvent","enabled": true}]' \
    --workspace <log-analytics-workspace-id>
```

## Security Best Practices

1. **Access Control**
   - Use Azure RBAC for fine-grained permissions
   - Implement just-in-time access
   - Regular access reviews

2. **Encryption**
   - Use customer-managed keys
   - Implement key rotation policies
   - Enable encryption at rest and in transit

3. **Monitoring**
   - Enable Azure Monitor
   - Configure alerts for suspicious activities
   - Regular audit log reviews

## Networking

1. **Private Endpoints**
   - Configure private endpoints for all services
   - Use private DNS zones
   - Implement network security groups

2. **Network Isolation**
   - Use virtual networks
   - Configure service endpoints
   - Implement proper subnet segregation

## Troubleshooting

Common issues and solutions:

1. **Container Group Creation Fails**
   - Verify TEE support in region
   - Check resource quotas
   - Validate execution policy

2. **Access Issues**
   - Verify RBAC assignments
   - Check managed identity configuration
   - Validate network access

3. **Attestation Failures**
   - Verify attestation provider setup
   - Check container configuration
   - Validate TEE requirements

## Next Steps

1. Configure collaboration policies (see [Collaboration Guide](./collaboration.md))
2. Set up monitoring and alerting
3. Implement backup and disaster recovery
4. Configure data integration pipelines

## Additional Resources

- [Infrastructure Templates](../bicep/)
- [Security Configuration](../security.md)
- [Official Documentation](https://learn.microsoft.com/azure/confidential-computing/confidential-clean-rooms)
