# Azure Cosmos DB for Agent Memory and Thread Storage

## Overview

Azure Cosmos DB provides robust and scalable storage capabilities for agent-based systems, particularly useful for maintaining agent memory, conversation threads, and related metadata. The integration through Azure AI Foundry enables building intelligent, stateful agentic applications with persistent thread storage.

## Key Features for Agent Systems

1. **Thread Storage**
   - Persistent storage of conversation threads
   - Scalable data management
   - Support for complex metadata 

2. **Vector Search Capabilities**
   - Built-in vector search for semantic retrieval
   - Efficient similarity searches
   - Supports embeddings storage and retrieval

3. **Full-text Search**
   - Advanced text search capabilities
   - Support for natural language queries
   - Context-aware search functionality

4. **Hybrid Search**
   - Combines vector and full-text search
   - Enhanced relevance in agent responses
   - Flexible query options

## Integration Steps

### 1. Setup in Azure AI Foundry

```plaintext
1. Register your Cosmos DB for NoSQL account in Azure AI Foundry
2. Configure container indexing based on use case:
   - Full-text search indexes
   - Vector search indexes
   - Hybrid search capability
```

### 2. Connection Configuration

1. Azure Subscription Setup:
   - Select appropriate subscription
   - Configure Cosmos DB account
   - Set up Entra ID authentication

2. Connection Parameters:
   - Define connection name
   - Configure access policies
   - Set up security parameters

## Best Practices for Agent Memory

1. **Data Organization**
   - Use separate containers for different memory types
   - Implement hierarchical data structures
   - Organize by conversation context

2. **Performance Optimization**
   - Implement proper partitioning strategy
   - Use appropriate indexing policies
   - Optimize query patterns

3. **Memory Management**
   - Implement TTL (Time-To-Live) for temporary data
   - Archive old conversations systematically
   - Maintain efficient data lifecycle

## Sample Integration Code

```python
# Example Python code for agent memory integration
from azure.cosmos import CosmosClient

def store_agent_memory(conversation_id, memory_data):
    client = CosmosClient(endpoint, credential)
    database = client.get_database_client(database_name)
    container = database.get_container_client(container_name)
    
    memory_item = {
        'id': conversation_id,
        'type': 'agent_memory',
        'data': memory_data,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    return container.create_item(memory_item)
```

## Security Considerations

1. **Data Protection**
   - Implement encryption at rest
   - Use secure connection strings
   - Enable Entra ID authentication

2. **Access Control**
   - Implement role-based access
   - Use managed identities
   - Regular security audits

3. **Compliance**
   - Follow data residency requirements
   - Implement audit logging
   - Maintain compliance certificates

## Scalability Features

1. **Automatic Scaling**
   - Throughput adjustment
   - Storage expansion
   - Request unit management

2. **Global Distribution**
   - Multi-region deployment
   - Automatic replication
   - Geo-redundancy

## Monitoring and Maintenance

1. **Performance Monitoring**
   - Track RU consumption
   - Monitor latency
   - Analyze usage patterns

2. **Maintenance Tasks**
   - Regular backup verification
   - Index optimization
   - Capacity planning

## Cost Management

1. **Optimization Strategies**
   - Proper capacity planning
   - Efficient data modeling
   - Resource monitoring

2. **Cost Control**
   - Set budget alerts
   - Monitor usage metrics
   - Implement cost optimization

## Azure AI Foundry Integration

### 1. Model Context Protocol Integration

1. **MCP Server Configuration**
   ```json
   {
     "mcp": {
       "endpoint": "https://your-cosmosdb-account.documents.azure.com",
       "databaseId": "AgentDB",
       "containerId": "Conversations",
       "partitionKey": "/sessionId"
     }
   }
   ```

2. **Data Access Patterns**
   ```javascript
   // Example MCP handler for conversation history
   async function handleConversationQuery(context) {
     const container = await getContainer();
     const query = {
       query: "SELECT * FROM c WHERE c.sessionId = @sessionId",
       parameters: [
         { name: "@sessionId", value: context.sessionId }
       ]
     };
     return await container.items.query(query).fetchAll();
   }
   ```

### 2. Bot Service Integration

1. **State Management**
   ```javascript
   // Example Bot Framework state storage
   class CosmosDBStorage {
     async write(changes) {
       const container = await this.getContainer();
       const batch = container.batch();
       
       for (const [key, change] of Object.entries(changes)) {
         batch.upsertItem({
           id: key,
           state: change,
           timestamp: new Date().toISOString()
         });
       }
       
       await batch.execute();
     }
   }
   ```

2. **Turn Context Storage**
   ```javascript
   // Example turn context persistence
   class CosmosTurnContext {
     async saveContext(context) {
       const container = await this.getContainer();
       await container.items.upsert({
         id: context.activity.id,
         channelId: context.activity.channelId,
         conversation: context.activity.conversation,
         timestamp: new Date().toISOString(),
         turnData: context.turnState.get('turnData')
       });
     }
   }
   ```

### 3. Agent Orchestration

1. **Multi-Agent Coordination**
   ```javascript
   // Example agent task distribution
   class AgentOrchestrator {
     async distributeTask(task) {
       const container = await this.getContainer();
       
       // Create task record
       const taskRecord = {
         id: uuidv4(),
         type: task.type,
         status: 'pending',
         created: new Date().toISOString(),
         vectors: {
           description: await this.getEmbedding(task.description)
         }
       };
       
       await container.items.create(taskRecord);
       
       // Find suitable agent
       const query = {
         query: "SELECT * FROM c WHERE c.type = 'agent' AND c.status = 'available'"
       };
       
       const { resources: agents } = await container.items
         .query(query)
         .fetchAll();
         
       return await this.assignTask(agents[0], taskRecord);
     }
   }
   ```

2. **Agent State Management**
   ```javascript
   // Example agent state tracking
   class AgentStateManager {
     async updateAgentState(agentId, state) {
       const container = await this.getContainer();
       const { resource: agent } = await container.item(agentId, agentId).read();
       
       agent.state = state;
       agent.lastUpdated = new Date().toISOString();
       
       await container.item(agentId, agentId).replace(agent);
     }
   }
   ```

### 4. Knowledge Management

1. **Vector-Enabled Knowledge Base**
   ```javascript
   // Example knowledge base schema
   const knowledgeSchema = {
     id: "string",
     content: "string",
     embedding: "vector<1536>",
     metadata: {
       source: "string",
       timestamp: "string",
       confidence: "number"
     }
   };
   ```

2. **Semantic Search Integration**
   ```javascript
   // Example semantic search implementation
   class SemanticKnowledgeBase {
     async findRelevantKnowledge(query) {
       const queryEmbedding = await this.getEmbedding(query);
       const container = await this.getContainer();
       
       const searchQuery = {
         vector: queryEmbedding,
         k: 5,
         field: "embedding"
       };
       
       return await container.items
         .vectorSearch(searchQuery)
         .fetchAll();
     }
   }
   ```

### 5. Monitoring and Analytics

1. **Agent Performance Tracking**
   ```javascript
   // Example performance monitoring
   class AgentAnalytics {
     async trackAgentMetrics(agentId, metrics) {
       const container = await this.getContainer();
       await container.items.create({
         id: uuidv4(),
         agentId: agentId,
         metrics: metrics,
         timestamp: new Date().toISOString()
       });
     }
   }
   ```

2. **System Health Monitoring**
   ```javascript
   // Example health check implementation
   class SystemHealth {
     async checkSystemHealth() {
       const container = await this.getContainer();
       const metrics = {
         agentCount: await this.getActiveAgentCount(),
         pendingTasks: await this.getPendingTaskCount(),
         averageResponseTime: await this.getAverageResponseTime()
       };
       
       await container.items.create({
         id: uuidv4(),
         type: 'health_check',
         metrics: metrics,
         timestamp: new Date().toISOString()
       });
     }
   }
   ```

## References

- [Azure AI Agent Service Documentation](https://learn.microsoft.com/en-us/azure/ai-services/agents/overview)
- [Vector Search Documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search)
- [Full-text Search Guide](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/full-text-search)
- [Hybrid Search Implementation](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/hybrid-search)
