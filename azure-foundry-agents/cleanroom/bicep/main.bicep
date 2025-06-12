@description('Name of the clean room workspace')
param cleanRoomName string

@description('Location for the clean room workspace')
param location string = resourceGroup().location

@description('Tags for the resources')
param tags object = {
  environment: 'dev'
  purpose: 'cleanroom'
}

@description('SKU for container instances')
param containerInstancesSku string = 'Confidential'

@description('Enable system assigned managed identity')
param systemAssignedIdentity bool = true

@description('Object ID of user assigned managed identity')
param userAssignedIdentityId string = ''

var containerRegistryName = 'acr${cleanRoomName}'
var keyVaultName = 'kv-${cleanRoomName}'
var storageAccountName = 'sta${cleanRoomName}'
var containerGroupName = 'ci-${cleanRoomName}'

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: location
  sku: {
    name: 'Premium'
  }
  properties: {
    adminUserEnabled: false
    encryption: {
      status: 'enabled'
      keyVaultProperties: {
        identity: userAssignedIdentityId
      }
    }
  }
  tags: tags
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'Premium'
    }
    enableRbacAuthorization: true
    enablePurgeProtection: true
    softDeleteRetentionInDays: 90
  }
  tags: tags
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    encryption: {
      keySource: 'Microsoft.Keyvault'
      keyvaultproperties: {
        keyname: 'cleanroom-key'
        keyvaulturi: keyVault.properties.vaultUri
      }
    }
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
  tags: tags
}

// Container Group
resource containerGroup 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
  name: containerGroupName
  location: location
  identity: {
    type: systemAssignedIdentity ? 'SystemAssigned' : 'UserAssigned'
    userAssignedIdentities: !empty(userAssignedIdentityId) ? {
      '${userAssignedIdentityId}': {}
    } : null
  }
  properties: {
    sku: containerInstancesSku
    confidentialComputingProperties: {
      isolationType: 'HyperV'
      ccePolicy: {
        type: 'AzurePolicy'
      }
    }
    containers: [
      {
        name: 'main'
        properties: {
          image: '${containerRegistry.name}.azurecr.io/cleanroom/main:latest'
          resources: {
            requests: {
              cpu: 2
              memoryInGB: 4
            }
          }
          environmentVariables: [
            {
              name: 'AZURE_CLIENT_ID'
              value: systemAssignedIdentity ? containerGroup.identity.principalId : userAssignedIdentityId
            }
            {
              name: 'KEY_VAULT_URL'
              value: keyVault.properties.vaultUri
            }
            {
              name: 'STORAGE_ACCOUNT'
              value: storageAccount.name
            }
          ]
        }
      }
      {
        name: 'key-release'
        properties: {
          image: 'mcr.microsoft.com/confidential/accci/skr:latest'
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1
            }
          }
        }
      }
    ]
    osType: 'Linux'
    restartPolicy: 'Always'
  }
  tags: tags
}

output containerGroupId string = containerGroup.id
output keyVaultUri string = keyVault.properties.vaultUri
output storageAccountName string = storageAccount.name
output containerRegistryName string = containerRegistry.name
