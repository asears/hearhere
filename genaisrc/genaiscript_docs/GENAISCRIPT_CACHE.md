# GenAIScript Caching with Azure

## Overview

GenAIScript provides comprehensive caching capabilities when working with Azure services. This document covers caching strategies, implementation patterns, and best practices for optimizing LLM applications using Azure caching services.

## Azure Cache Services

### 1. Azure Cache for Redis

```javascript
script({
  cache: {
    type: 'azure_redis',
    connection: {
      endpoint: process.env.AZURE_REDIS_HOST,
      key: process.env.AZURE_REDIS_KEY,
      ssl: true
    }
  }
})
```

#### Configuration Options
```javascript
{
  maxmemory: '2gb',
  evictionPolicy: 'volatile-lru',
  connectTimeout: 5000,
  commandTimeout: 2000,
  retry: {
    maxAttempts: 3,
    backoff: 'exponential'
  }
}
```

### 2. Azure Storage Caching

```javascript
script({
  cache: {
    type: 'azure_storage',
    account: process.env.AZURE_STORAGE_ACCOUNT,
    container: 'llm-cache',
    ttl: 24 * 60 * 60 // 24 hours
  }
})
```

### 3. Azure CDN Caching

```javascript
script({
  cache: {
    type: 'azure_cdn',
    profile: 'llm-cdn',
    endpoint: 'content',
    rules: [
      {
        match: '*.json',
        ttl: 3600
      }
    ]
  }
})
```

## Caching Strategies

### 1. Response Caching

```javascript
// Cache LLM responses
const cache = await createCache('azure_redis')

async function getCachedResponse(prompt) {
  const cacheKey = await hashPrompt(prompt)
  
  // Try cache first
  let response = await cache.get(cacheKey)
  if (response) {
    return response
  }
  
  // Generate and cache
  response = await generateResponse(prompt)
  await cache.set(cacheKey, response, {
    ttl: 3600,
    tags: ['llm-response']
  })
  
  return response
}
```

### 2. Vector Cache

```javascript
// Cache embeddings
script({
  vectorCache: {
    store: 'azure_redis',
    dimension: 1536,
    similarity: 'cosine',
    prefixKey: 'embedding:'
  }
})

async function getEmbedding(text) {
  const cache = await getVectorCache()
  
  // Check cache
  const cached = await cache.nearest(text, {
    similarity: 0.95,
    max: 1
  })
  
  if (cached.length > 0) {
    return cached[0]
  }
  
  // Generate new embedding
  const embedding = await generateEmbedding(text)
  await cache.add(text, embedding)
  
  return embedding
}
```

### 3. Token Cache

```javascript
// Cache token usage
const tokenCache = {
  async track(prompt, usage) {
    await cache.hincrby('token_usage', getDate(), usage)
  },
  
  async getUsage(timeframe) {
    const now = new Date()
    const start = subtractTime(now, timeframe)
    
    return await cache.hgetall('token_usage', {
      start,
      end: now
    })
  }
}
```

## Security & Privacy

### 1. Data Encryption

```javascript
script({
  cache: {
    encryption: {
      keyVault: process.env.AZURE_KEYVAULT_URL,
      keyName: 'cache-key',
      algorithm: 'RSA-OAEP-256'
    }
  }
})
```

### 2. Access Control

```javascript
script({
  cache: {
    rbac: {
      roles: ['Cache.Reader', 'Cache.Writer'],
      scope: resourceId,
      principalId: managedIdentity
    },
    network: {
      privateEndpoint: true,
      allowedIps: ['10.0.0.0/24']
    }
  }
})
```

### 3. Monitoring

```javascript
script({
  cache: {
    monitoring: {
      metrics: ['hits', 'misses', 'latency'],
      alerts: [
        {
          name: 'HighMissRate',
          threshold: 0.3,
          window: '5m'
        }
      ]
    }
  }
})
```

## Performance Optimization

### 1. Batching

```javascript
async function batchProcess(items) {
  const cache = await getCache()
  
  // Get cached items
  const keys = items.map(i => getCacheKey(i))
  const cached = await cache.mget(keys)
  
  // Process missing items
  const missing = items.filter((_, i) => !cached[i])
  const processed = await processItems(missing)
  
  // Cache new results
  await cache.mset(
    missing.map(i => ({
      key: getCacheKey(i),
      value: processed[i],
      ttl: 3600
    }))
  )
  
  // Combine results
  return items.map((_, i) => cached[i] || processed[i])
}
```

### 2. Pipeline Processing

```javascript
const pipeline = cache.pipeline()

// Add operations
items.forEach(item => {
  pipeline.set(item.key, item.value)
  pipeline.expire(item.key, 3600)
})

// Execute pipeline
await pipeline.exec()
```

### 3. Compression

```javascript
script({
  cache: {
    compression: {
      algorithm: 'gzip',
      threshold: '1kb',
      level: 6
    }
  }
})
```

## Advanced Features

### 1. Cache Invalidation

```javascript
class CacheManager {
  async invalidate(pattern) {
    const keys = await this.cache.keys(pattern)
    await this.cache.del(keys)
  }
  
  async invalidateTag(tag) {
    await this.cache.delBytag(tag)
  }
  
  async clear() {
    await this.cache.flushall()
  }
}
```

### 2. Cache Warming

```javascript
async function warmCache() {
  const prompts = await getCommonPrompts()
  
  await Promise.all(
    prompts.map(async prompt => {
      if (!await cache.exists(prompt.key)) {
        const response = await generateResponse(prompt)
        await cache.set(prompt.key, response)
      }
    })
  )
}
```

### 3. Cache Analytics

```javascript
class CacheAnalytics {
  async getMetrics(timeframe) {
    return {
      hitRate: await this.getHitRate(timeframe),
      size: await this.getSize(),
      popular: await this.getPopularKeys(10),
      latency: await this.getLatencyStats()
    }
  }
  
  async optimize() {
    const metrics = await this.getMetrics('1d')
    return await this.applyOptimizations(metrics)
  }
}
```

## Best Practices

### 1. Cache Strategy

- Use appropriate TTL values
- Implement cache warming
- Handle cache misses gracefully
- Use cache tags for organization

### 2. Performance

- Batch operations when possible
- Use compression for large values
- Implement circuit breakers
- Monitor cache statistics

### 3. Security

- Encrypt sensitive data
- Use managed identities
- Implement access controls
- Regular security audits

### 4. Maintenance

- Regular cache cleanup
- Monitor memory usage
- Implement backup strategies
- Version cache keys

## References

- [Azure Cache for Redis Documentation](https://docs.microsoft.com/azure/azure-cache-for-redis/)
- [Azure Storage Documentation](https://docs.microsoft.com/azure/storage/)
- [Azure CDN Documentation](https://docs.microsoft.com/azure/cdn/)
- [GenAIScript Caching](https://microsoft.github.io/genaiscript/reference/scripts/cache/)
