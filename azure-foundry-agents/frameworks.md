# AI Frameworks in Azure Foundry Applications

## LlamaIndex Integration

### Overview

LlamaIndex provides data framework capabilities for connecting LLMs to external data sources. In Azure AI Foundry applications, it's particularly useful for:
- Data ingestion and structuring
- Query interface creation
- Response synthesis
- Knowledge base management

### Implementation Patterns

1. **Data Connectors**
```python
from llama_index import (
    VectorStoreIndex,
    StorageContext,
    ServiceContext
)
from llama_index.vector_stores.azure_cosmos import AzureCosmosDBVectorSearch
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding

# Azure-optimized setup
def setup_llama_index():
    # Use Azure OpenAI embeddings
    embed_model = AzureOpenAIEmbedding(
        model="text-embedding-ada-002",
        deployment_name="embedding-deployment",
        api_key=DefaultAzureCredential()
    )
    
    # Use Cosmos DB vector store
    vector_store = AzureCosmosDBVectorSearch(
        credential=DefaultAzureCredential(),
        database_name="knowledge_base",
        container_name="embeddings"
    )
    
    # Create storage context
    storage_context = StorageContext.from_defaults(
        vector_store=vector_store
    )
    
    return VectorStoreIndex([], storage_context=storage_context)
```

2. **Query Engine Configuration**
```python
from llama_index.query_engine import RetrieverQueryEngine
from llama_index.response_synthesizers import CompactAndRefine

def create_query_engine(index):
    # Configure retriever
    retriever = index.as_retriever(
        similarity_top_k=5
    )
    
    # Configure response synthesizer
    response_synthesizer = CompactAndRefine(
        service_context=ServiceContext.from_defaults(
            llm_predictor=AzureOpenAIPredictor()
        )
    )
    
    return RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=response_synthesizer
    )
```

### Azure AI Foundry Integration

1. **Knowledge Base Creation**
```python
def create_knowledge_base():
    # Initialize LlamaIndex
    index = setup_llama_index()
    
    # Add documents to index
    documents = SimpleDirectoryReader('data').load_data()
    index.insert_batch(documents)
    
    # Create query engine
    query_engine = create_query_engine(index)
    
    return query_engine
```

2. **Agent Integration**
```python
# Agent using LlamaIndex for knowledge retrieval
class KnowledgeableAgent:
    def __init__(self):
        self.query_engine = create_knowledge_base()
    
    async def process_query(self, query: str):
        response = self.query_engine.query(query)
        return {
            'answer': response.response,
            'sources': response.source_nodes
        }
```

## Semantic Kernel Integration

### Overview

Semantic Kernel provides a flexible architecture for building AI applications with pluggable components. In Azure AI Foundry, it's used for:
- Plugin management
- Semantic function orchestration
- Memory management
- Skill development

### Implementation Patterns

1. **Kernel Setup**
```python
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion

async def setup_kernel():
    kernel = Kernel()
    deployment = "gpt-4"
    
    # Use Azure OpenAI with managed identity
    chat_service = AzureChatCompletion(
        deployment_name=deployment,
        credentials=DefaultAzureCredential()
    )
    
    kernel.add_chat_service("chat-gpt4", chat_service)
    return kernel
```

2. **Skill Development**
```python
from semantic_kernel.skill_definition import sk_function

class AgentSkill:
    @sk_function(
        description="Analyzes sentiment of text",
        name="analyze_sentiment"
    )
    def analyze_sentiment(self, text: str) -> str:
        # Implementation
        pass
    
    @sk_function(
        description="Extracts key information",
        name="extract_info"
    )
    def extract_info(self, text: str) -> dict:
        # Implementation
        pass
```

### Azure AI Foundry Integration

1. **Plugin Management**
```python
async def register_plugins(kernel: Kernel):
    # Load native skills
    kernel.import_skill(AgentSkill(), "agent")
    
    # Load semantic skills
    skills_directory = "skills"
    kernel.import_semantic_skill_from_directory(skills_directory)
```

2. **Memory Integration**
```python
from semantic_kernel.memory import VolatileMemoryStore
from semantic_kernel.connectors.memory.azure_cosmos import CosmosDBMemoryStore

async def setup_memory(kernel: Kernel):
    # Use Cosmos DB for persistent memory
    memory_store = CosmosDBMemoryStore(
        credential=DefaultAzureCredential(),
        database_name="agent_memory",
        container_name="semantic_memory"
    )
    
    kernel.register_memory_store(memory_store)
    return kernel
```

## AutoGen Integration

### Overview

AutoGen enables the development of LLM applications using multiple conversable agents. In Azure AI Foundry, it's used for:
- Multi-agent orchestration
- Task planning and execution
- Agent conversation management
- Human-in-the-loop interactions

### Implementation Patterns

1. **Agent Configuration**
```python
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

def setup_agents():
    # Configure agents with Azure OpenAI
    config_list = config_list_from_json(
        env_or_file="azure.json",
        filter_dict={
            "model": ["gpt-4", "gpt-3.5-turbo"]
        }
    )
    
    # Create assistant agent
    assistant = AssistantAgent(
        name="assistant",
        llm_config={"config_list": config_list}
    )
    
    # Create user proxy agent
    user_proxy = UserProxyAgent(
        name="user_proxy",
        human_input_mode="NEVER"
    )
    
    return assistant, user_proxy
```

2. **Conversation Management**
```python
async def manage_conversation(
    assistant: AssistantAgent,
    user_proxy: UserProxyAgent,
    task: str
):
    await user_proxy.initiate_chat(
        assistant,
        message=task
    )
    
    # Process the conversation results
    chat_history = assistant.chat_history
    return chat_history
```

### Azure AI Foundry Integration

1. **Task Execution**
```python
class AutoGenExecutor:
    def __init__(self):
        self.assistant, self.user_proxy = setup_agents()
    
    async def execute_task(self, task: str):
        result = await manage_conversation(
            self.assistant,
            self.user_proxy,
            task
        )
        return self._process_result(result)
    
    def _process_result(self, result):
        # Process and format the result
        pass
```

2. **Agent Cooperation**
```python
from autogen import GroupChat, GroupChatManager

class AgentGroup:
    def __init__(self):
        self.agents = self._setup_agents()
        self.group_chat = self._create_group_chat()
    
    def _setup_agents(self):
        # Create specialized agents
        coder = AssistantAgent("coder")
        reviewer = AssistantAgent("reviewer")
        tester = AssistantAgent("tester")
        return [coder, reviewer, tester]
    
    def _create_group_chat(self):
        return GroupChat(
            agents=self.agents,
            messages=[],
            max_round=10
        )
```

## Framework Interoperability

### 1. Combined Usage

```python
class HybridAgent:
    def __init__(self):
        self.llama_index = create_knowledge_base()
        self.kernel = setup_kernel()
        self.autogen = AutoGenExecutor()
    
    async def process_request(self, request: str):
        # Use LlamaIndex for knowledge retrieval
        knowledge = self.llama_index.query(request)
        
        # Use Semantic Kernel for processing
        processed = await self.kernel.run_skill(
            "agent",
            "process_knowledge",
            knowledge
        )
        
        # Use AutoGen for task execution
        result = await self.autogen.execute_task(processed)
        
        return result
```

### 2. Data Flow

```python
async def handle_complex_task(task: str):
    # Initialize components
    knowledge_base = create_knowledge_base()
    kernel = await setup_kernel()
    autogen_executor = AutoGenExecutor()
    
    # Knowledge retrieval
    context = knowledge_base.query(task)
    
    # Semantic processing
    processed_task = await kernel.run_skill(
        "agent",
        "plan_task",
        context
    )
    
    # Task execution
    result = await autogen_executor.execute_task(processed_task)
    
    return result
```

## Best Practices

1. **Framework Selection**
   - Use LlamaIndex for knowledge base and retrieval
   - Use Semantic Kernel for plugin architecture
   - Use AutoGen for multi-agent orchestration

2. **Integration Patterns**
   - Maintain separation of concerns
   - Use async/await for operations
   - Implement proper error handling
   - Monitor performance metrics

3. **Resource Management**
   - Implement connection pooling
   - Cache frequently used data
   - Use appropriate timeouts
   - Handle rate limiting

4. **Security Considerations**
   - Use managed identities
   - Implement proper RBAC
   - Secure sensitive data
   - Monitor access patterns

## References

- [LlamaIndex Documentation](https://gpt-index.readthedocs.io/)
- [Semantic Kernel Documentation](https://learn.microsoft.com/en-us/semantic-kernel/overview/)
- [AutoGen Documentation](https://microsoft.github.io/autogen/)
- [Azure AI Foundry Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/)
