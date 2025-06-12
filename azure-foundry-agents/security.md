# Security Configuration for Azure AI Foundry Applications

## RBAC Role Assignments

### 1. Azure AI Services

```json
{
    "roles": {
        "AI Service User": {
            "id": "f0c7c914-9f02-4937-93af-045f52e523d4",
            "description": "Use AI Service resources",
            "permissions": [
                "Microsoft.CognitiveServices/accounts/read",
                "Microsoft.CognitiveServices/accounts/listKeys/action"
            ]
        },
        "AI Service Contributor": {
            "id": "0a9a7791-c26b-4bbb-9648-59f21e9d6dcd",
            "description": "Manage AI Service resources",
            "permissions": [
                "Microsoft.CognitiveServices/*"
            ]
        }
    }
}
```

### 2. Azure Functions

```json
{
    "roles": {
        "Functions Developer": {
            "id": "827f2c84-7c9c-4f8e-8e9a-4c3c47a0ef7a",
            "description": "Deploy and manage functions",
            "permissions": [
                "Microsoft.Web/sites/functions/*",
                "Microsoft.Web/sites/host/keys/*"
            ]
        },
        "Functions Monitor": {
            "id": "31f2c84-7c9c-4f8e-8e9a-4c3c47a0ef7b",
            "description": "Monitor function performance",
            "permissions": [
                "Microsoft.Web/sites/functions/read",
                "Microsoft.Insights/metrics/read"
            ]
        }
    }
}
```

### 3. Azure AI Foundry

```json
{
    "roles": {
        "AI Foundry Developer": {
            "description": "Develop and deploy AI models",
            "permissions": [
                "Microsoft.AIFoundry/models/*",
                "Microsoft.AIFoundry/deployments/*"
            ]
        },
        "AI Foundry Operator": {
            "description": "Monitor and operate deployments",
            "permissions": [
                "Microsoft.AIFoundry/deployments/read",
                "Microsoft.AIFoundry/metrics/read"
            ]
        }
    }
}
```

## Managed Identity Configuration

### 1. System-Assigned Identity

```azurecli
# Enable system-assigned identity for a function app
az functionapp identity assign \
    --name MyFunctionApp \
    --resource-group MyResourceGroup

# Grant AI service access to the function app
az role assignment create \
    --assignee-object-id <function-app-principal-id> \
    --role "AI Service User" \
    --scope /subscriptions/<subscription-id>/resourceGroups/MyResourceGroup/providers/Microsoft.CognitiveServices/accounts/MyAIService
```

### 2. User-Assigned Identity

```azurecli
# Create user-assigned identity
az identity create \
    --name MyManagedIdentity \
    --resource-group MyResourceGroup

# Assign to function app
az functionapp identity assign \
    --name MyFunctionApp \
    --resource-group MyResourceGroup \
    --identities "/subscriptions/<subscription-id>/resourcegroups/MyResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/MyManagedIdentity"
```

### 3. DefaultAzureCredential Implementation

```python
from azure.identity import DefaultAzureCredential
from azure.ai.services import AIService

def get_ai_service_client():
    # DefaultAzureCredential automatically tries different authentication methods
    credential = DefaultAzureCredential()
    
    return AIService(
        endpoint="https://myservice.cognitiveservices.azure.com",
        credential=credential
    )
```

## Secure Configuration Storage

### 1. Local Development (Windows)

```powershell
# Store secrets in Windows Credential Manager
cmdkey /generic:AI_SERVICE_KEY /user:USER /pass:"your-secret-key"

# Access in code using Windows Credential Manager
$credential = Get-StoredCredential -Target "AI_SERVICE_KEY"
$secret = $credential.GetNetworkCredential().Password
```

### 2. Azure Key Vault Integration

```python
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

class SecureConfig:
    def __init__(self):
        credential = DefaultAzureCredential()
        self.secret_client = SecretClient(
            vault_url="https://my-keyvault.vault.azure.net/",
            credential=credential
        )
    
    async def get_secret(self, secret_name: str) -> str:
        secret = await self.secret_client.get_secret(secret_name)
        return secret.value

# Usage in Function App
def get_function_config():
    config = SecureConfig()
    return {
        'AI_SERVICE_KEY': config.get_secret('ai-service-key'),
        'DATABASE_CONNECTION': config.get_secret('db-connection')
    }
```

### 3. Azure App Configuration

```python
from azure.appconfiguration import AzureAppConfigurationClient
from azure.identity import DefaultAzureCredential

class AppConfig:
    def __init__(self):
        credential = DefaultAzureCredential()
        self.client = AzureAppConfigurationClient(
            endpoint="https://myappconfig.azconfig.io",
            credential=credential
        )
    
    def get_config(self, key: str) -> str:
        setting = self.client.get_configuration_setting(key=key)
        return setting.value
```

## Security Scanning

### 1. Local SAST Scanning

```powershell
# Using Bandit for Python
pip install bandit
bandit -r . -f json -o bandit-results.json

# Using DevSkim
dotnet tool install -g Microsoft.CST.DevSkim.CLI
devskim analyze ./src
```

### 2. GitHub Actions Integration

```yaml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: SAST Scan
      uses: github/codeql-action/analyze@v2
      with:
        languages: python, javascript
    
    - name: DevSkim scan
      uses: microsoft/devskim-action@v1
      with:
        directory-to-scan: src
```

### 3. Azure DAST Scanning

```yaml
# Azure Pipeline DAST Configuration
steps:
- task: AzureWebAppUnitTestScanner@0
  inputs:
    webAppUrl: 'https://my-app.azurewebsites.net'
    scanType: 'Full'
    authType: 'managed-identity'

- task: OWASP-ZAP@1
  inputs:
    targetUrl: 'https://my-app.azurewebsites.net'
    reportType: 'JSON'
    authToken: '$(System.AccessToken)'
```

## Runtime Security

### 1. Network Security Groups

```azurecli
# Create NSG for AI Services
az network nsg create \
    --name ai-services-nsg \
    --resource-group MyResourceGroup

# Add inbound rule
az network nsg rule create \
    --name allow-https \
    --nsg-name ai-services-nsg \
    --priority 100 \
    --resource-group MyResourceGroup \
    --access Allow \
    --protocol Tcp \
    --direction Inbound \
    --source-address-prefixes VirtualNetwork \
    --source-port-ranges * \
    --destination-address-prefixes * \
    --destination-port-ranges 443
```

### 2. Private Endpoints

```azurecli
# Create private endpoint for AI service
az network private-endpoint create \
    --name ai-service-pe \
    --resource-group MyResourceGroup \
    --vnet-name MyVNet \
    --subnet MySubnet \
    --private-connection-resource-id /subscriptions/<subscription-id>/resourceGroups/MyResourceGroup/providers/Microsoft.CognitiveServices/accounts/MyAIService \
    --group-id aistudio \
    --connection-name ai-service-connection
```

### 3. TLS Configuration

```python
# Enforce TLS 1.2
import ssl
import requests

def create_secure_session():
    session = requests.Session()
    session.verify = True
    session.mount('https://', requests.adapters.HTTPAdapter(
        ssl_version=ssl.PROTOCOL_TLSv1_2
    ))
    return session
```

## Monitoring and Auditing

### 1. Azure Monitor Integration

```python
from azure.monitor.opentelemetry import configure_azure_monitor

def setup_monitoring():
    configure_azure_monitor(
        connection_string="InstrumentationKey=<key>;IngestionEndpoint=<endpoint>",
        credential=DefaultAzureCredential()
    )
```

### 2. Security Center Integration

```azurecli
# Enable Security Center for AI services
az security assessment create \
    --assessment-type "Microsoft.Security/assessments" \
    --resource-group MyResourceGroup \
    --resource-name MyAIService \
    --status-code "Healthy" \
    --status-cause "Monitored by Security Center"
```

### 3. Audit Logging

```python
from azure.monitor.opentelemetry import AzureMonitorTraceExporter
from opentelemetry import trace

def setup_audit_logging():
    tracer = trace.get_tracer(__name__)
    exporter = AzureMonitorTraceExporter(
        credential=DefaultAzureCredential()
    )
    
    return tracer, exporter
```

## References

- [Azure RBAC Documentation](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview)
- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/fundamentals/best-practices-concepts)
- [GitHub Security Features](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/Top10/)
