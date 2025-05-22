# Pandas Deep Dive

## Data Types and Memory Management

### Understanding Pandas dtypes

#### 1. Numeric Types
```python
# Int types and their memory usage
int8    # -128 to 127 (1 byte)
int16   # -32768 to 32767 (2 bytes)
int32   # -2^31 to 2^31-1 (4 bytes)
int64   # -2^63 to 2^63-1 (8 bytes)

# Float types
float32 # Single precision (4 bytes)
float64 # Double precision (8 bytes)
```

#### 2. String Types
```python
# Object dtype (default for strings)
df['text'] = df['text'].astype('object')  # Flexible but memory-intensive

# Categorical (memory efficient for repeated values)
df['category'] = df['category'].astype('category')

# String[pyarrow] (efficient for string operations)
df['text'] = df['text'].astype('string[pyarrow]')
```

#### 3. DateTime Types
```python
# Efficient datetime handling
df['date'] = pd.to_datetime(df['date'])
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')  # Faster with format
```

### Memory Management Techniques

#### 1. Copy-on-Write (CoW)
```python
# Before pandas 2.0
df2 = df.copy()  # Creates full copy
df2['new'] = 1   # Modifies copy

# With CoW (pandas 2.0+)
df2 = df  # No copy created
df2['new'] = 1   # Copy created only for modified column
```

#### 2. Memory Usage Analysis
```python
# Detailed memory usage
df.memory_usage(deep=True)

# Per-column memory optimization
def optimize_dtypes(df):
    for col in df.select_dtypes('number').columns:
        col_min, col_max = df[col].min(), df[col].max()
        # Choose smallest possible int type
        if col_min >= 0:
            if col_max < 255: df[col] = df[col].astype('uint8')
            elif col_max < 65535: df[col] = df[col].astype('uint16')
        else:
            if col_min > -128 and col_max < 127: df[col] = df[col].astype('int8')
            elif col_min > -32768 and col_max < 32767: df[col] = df[col].astype('int16')
    return df
```

## Advanced Performance Optimization

### 1. DataFrame Concatenation
```python
# Slow: Iterative append
for chunk in chunks:
    df = df.append(chunk)  # Creates new DataFrame each time

# Fast: Collect then concat
chunks_list = list(chunks)
df = pd.concat(chunks_list, axis=0)  # Single operation
```

### 2. Smart Aggregation
```python
# Slow: Multiple groupby operations
mean = df.groupby('key')['value'].mean()
std = df.groupby('key')['value'].std()

# Fast: Single groupby with multiple operations
stats = df.groupby('key')['value'].agg(['mean', 'std'])
```

### 3. Efficient Date Operations
```python
# Convert to DatetimeIndex for faster operations
df.index = pd.DatetimeIndex(df.index)

# Use partial string indexing
df['2023']  # All data for 2023
df['2023-01':'2023-06']  # Date range
```

## Hidden Pandas Gems

### 1. Eval and Query Engine
```python
# Complex calculations with eval
df.eval('total = price * quantity * (1 - discount)')

# Complex filtering with query
df.query('(price > 100) & (quantity > 10) | (discount > 0.5)')
```

### 2. Advanced Selection Methods
```python
# Select by dtypes
numerics = df.select_dtypes(include=['int64', 'float64'])

# Filter with regex
text_cols = df.filter(regex='^text_.*$')

# Select by memory usage
large_cols = df.columns[df.memory_usage(deep=True) > 1e6]
```

### 3. Efficient String Operations
```python
# Use StringDtype from PyArrow
df['text'] = df['text'].astype('string[pyarrow]')

# Vectorized string operations
df['text'] = df['text'].str.extract('(\d+)')  # Extract numbers
df['text'] = df['text'].str.replace('^', '', regex=True)  # Remove prefix
```

## Performance Anti-Patterns

### 1. Avoid These Patterns
```python
# Don't: Iterate over DataFrame
for index, row in df.iterrows():  # Slow
    result.append(process_row(row))

# Do: Use vectorization
result = df.apply(process_row, axis=1)  # Much faster

# Don't: Chain assignments
df['A'] = df['A'] + 1  # Creates copy
df['B'] = df['A'] + 2  # Creates another copy

# Do: Use compound assignment
df.loc[:, ['A', 'B']] = df[['A']].assign(
    A=lambda x: x['A'] + 1,
    B=lambda x: x['A'] + 2
)
```

### 2. Memory Leaks
```python
# Don't: Keep references to views
view = df[df['column'] > 0]  # Creates view
del df  # Original DataFrame still in memory due to view

# Do: Copy if needed
view = df[df['column'] > 0].copy()
del df  # Memory can be freed
```

## Advanced Index Operations

### 1. MultiIndex Optimization
```python
# Create sorted MultiIndex for better performance
df = df.set_index(['date', 'category']).sort_index()

# Use IndexSlice for complex selections
idx = pd.IndexSlice
df.loc[idx['2023-01':'2023-06', 'electronics'], :]
```

### 2. Index Alignment
```python
# Automatic alignment can be slow
result = df1 + df2  # Checks indexes

# Faster with known alignment
if df1.index.equals(df2.index):
    result = df1.values + df2.values
```

## Monitoring and Diagnostics

### Performance Metrics Collection
```python
from dataclasses import dataclass
from typing import Dict, Any
import time
import psutil
import pandas as pd

@dataclass
class OperationMetrics:
    duration: float
    memory_start: int
    memory_peak: int
    memory_end: int
    rows_processed: int
    operation_type: str
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'duration_ms': self.duration * 1000,
            'memory_increase_mb': (self.memory_end - self.memory_start) / (1024 * 1024),
            'peak_memory_mb': self.memory_peak / (1024 * 1024),
            'rows_per_second': self.rows_processed / self.duration if self.duration > 0 else 0,
            'operation': self.operation_type
        }

class PandasMonitor:
    def __init__(self):
        self.metrics_history = []
    
    def monitor(self, operation_type: str):
        def decorator(func):
            def wrapper(*args, **kwargs):
                process = psutil.Process()
                start_time = time.perf_counter()
                start_memory = process.memory_info().rss
                peak_memory = start_memory
                
                try:
                    result = func(*args, **kwargs)
                    
                    # Collect metrics
                    end_time = time.perf_counter()
                    end_memory = process.memory_info().rss
                    rows_processed = len(result) if isinstance(result, pd.DataFrame) else 0
                    
                    metrics = OperationMetrics(
                        duration=end_time - start_time,
                        memory_start=start_memory,
                        memory_peak=peak_memory,
                        memory_end=end_memory,
                        rows_processed=rows_processed,
                        operation_type=operation_type
                    )
                    
                    self.metrics_history.append(metrics.to_dict())
                    return result
                    
                except Exception as e:
                    end_time = time.perf_counter()
                    end_memory = process.memory_info().rss
                    print(f"Error in {operation_type}: {str(e)}")
                    print(f"Duration: {end_time - start_time:.2f}s")
                    print(f"Memory increase: {(end_memory - start_memory) / (1024 * 1024):.2f}MB")
                    raise
                    
            return wrapper
        return decorator

# Usage example
monitor = PandasMonitor()

@monitor.monitor('complex_transform')
def transform_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    # Complex transformations here
    return df

def get_performance_report():
    """Generate performance report from metrics history"""
    metrics_df = pd.DataFrame(monitor.metrics_history)
    return metrics_df.groupby('operation').agg({
        'duration_ms': ['mean', 'max'],
        'memory_increase_mb': 'mean',
        'rows_per_second': 'mean'
    })
```

### Memory Leak Detection
```python
class MemoryLeakDetector:
    def __init__(self, threshold_mb=100):
        self.threshold = threshold_mb * 1024 * 1024
        self.baseline = None
        self.snapshots = []
    
    def take_snapshot(self, label: str):
        """Take memory snapshot with label"""
        process = psutil.Process()
        current_memory = process.memory_info().rss
        
        if self.baseline is None:
            self.baseline = current_memory
        
        self.snapshots.append({
            'label': label,
            'memory': current_memory,
            'increase': current_memory - self.baseline
        })
        
        # Check for significant increases
        if current_memory - self.baseline > self.threshold:
            print(f"Warning: Memory increase of {(current_memory - self.baseline) / (1024 * 1024):.2f}MB detected at {label}")
    
    def report(self) -> pd.DataFrame:
        """Generate memory leak report"""
        df = pd.DataFrame(self.snapshots)
        df['memory_mb'] = df['memory'] / (1024 * 1024)
        df['increase_mb'] = df['increase'] / (1024 * 1024)
        return df
```

## Advanced Integration Patterns

### SQL Database Integration
```python
from sqlalchemy import create_engine
import pandas as pd
from typing import List, Optional

class DatabaseIntegration:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
    
    def efficient_read(self, query: str, chunksize: Optional[int] = None) -> pd.DataFrame:
        """Efficiently read from database"""
        if chunksize:
            chunks = []
            for chunk in pd.read_sql(query, self.engine, chunksize=chunksize):
                chunks.append(chunk)
            return pd.concat(chunks)
        return pd.read_sql(query, self.engine)
    
    def efficient_write(self, df: pd.DataFrame, table: str, if_exists: str = 'append'):
        """Efficiently write to database"""
        # Calculate optimal chunk size based on memory
        row_size = df.memory_usage(deep=True).sum() / len(df)
        optimal_chunk_size = max(1000, int(1e8 / row_size))  # Target 100MB chunks
        
        # Write in chunks
        for i in range(0, len(df), optimal_chunk_size):
            chunk = df.iloc[i:i + optimal_chunk_size]
            chunk.to_sql(
                table,
                self.engine,
                if_exists=if_exists if i == 0 else 'append',
                index=False,
                method='multi'
            )
```

### Apache Spark Integration
```python
from pyspark.sql import SparkSession
import pandas as pd

class SparkIntegration:
    def __init__(self, app_name: str = "PandasSparkBridge"):
        self.spark = (SparkSession.builder
                     .appName(app_name)
                     .config("spark.sql.execution.arrow.pyspark.enabled", "true")
                     .getOrCreate())
    
    def pandas_to_spark(self, df: pd.DataFrame):
        """Efficiently convert Pandas to Spark DataFrame"""
        return self.spark.createDataFrame(df)
    
    def spark_to_pandas(self, spark_df):
        """Efficiently convert Spark to Pandas DataFrame"""
        return spark_df.toPandas()
    
    def distributed_operation(self, df: pd.DataFrame, operation: callable):
        """Perform distributed operation using Spark"""
        spark_df = self.pandas_to_spark(df)
        result = operation(spark_df)
        return self.spark_to_pandas(result)
```

### Real-time Streaming
```python
import pandas as pd
from typing import Callable, Iterator
import queue
import threading

class StreamProcessor:
    def __init__(self, window_size: int = 1000):
        self.window_size = window_size
        self.buffer = queue.Queue()
        self.processing_thread = None
        self.stop_flag = threading.Event()
    
    def add_data(self, data: pd.DataFrame):
        """Add new data to processing queue"""
        self.buffer.put(data)
    
    def process_stream(self, processor: Callable[[pd.DataFrame], pd.DataFrame]):
        """Process streaming data with sliding window"""
        window = pd.DataFrame()
        
        while not self.stop_flag.is_set() or not self.buffer.empty():
            try:
                new_data = self.buffer.get(timeout=1)
                
                # Update window
                window = pd.concat([window, new_data]).tail(self.window_size)
                
                # Process window
                processed = processor(window)
                
                # Emit results
                yield processed
                
            except queue.Empty:
                continue
    
    def start_processing(self, processor: Callable[[pd.DataFrame], pd.DataFrame]):
        """Start processing in background thread"""
        def _process():
            for _ in self.process_stream(processor):
                pass
        
        self.processing_thread = threading.Thread(target=_process)
        self.processing_thread.start()
    
    def stop_processing(self):
        """Stop processing thread"""
        self.stop_flag.set()
        if self.processing_thread:
            self.processing_thread.join()
```

### Machine Learning Pipeline Integration
```python
from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
import numpy as np

class PandasTransformer(BaseEstimator, TransformerMixin):
    """Base class for pandas-based transformers"""
    
    def __init__(self, columns=None):
        self.columns = columns
    
    def fit(self, X, y=None):
        # Implement fitting logic
        return self
    
    def transform(self, X):
        # Implement transform logic
        return X

class EfficientEncoder(PandasTransformer):
    """Memory-efficient categorical encoder"""
    
    def __init__(self, columns=None, max_categories=100):
        super().__init__(columns)
        self.max_categories = max_categories
        self.encodings = {}
    
    def fit(self, X, y=None):
        if self.columns is None:
            self.columns = X.select_dtypes(include=['object']).columns
        
        for col in self.columns:
            value_counts = X[col].value_counts()
            top_categories = value_counts.head(self.max_categories).index
            self.encodings[col] = {
                val: idx for idx, val in enumerate(top_categories)
            }
        
        return self
    
    def transform(self, X):
        X = X.copy()
        for col, encoding in self.encodings.items():
            X[col] = X[col].map(encoding).fillna(-1).astype('int16')
        return X
```

## Cloud Platform Optimizations

### AWS Integration
```python
import pandas as pd
import s3fs
import pyarrow.parquet as pq
from typing import Optional, List

class S3DataFrameManager:
    """Efficient S3-based DataFrame operations"""
    
    def __init__(self, bucket: str, prefix: str = ''):
        self.bucket = bucket
        self.prefix = prefix
        self.fs = s3fs.S3FileSystem()
    
    def read_efficient(
        self,
        key: str,
        columns: Optional[List[str]] = None,
        partition_filters: Optional[List[tuple]] = None
    ) -> pd.DataFrame:
        """Efficiently read data from S3"""
        path = f"s3://{self.bucket}/{self.prefix}{key}"
        
        # Use PyArrow for efficient reading
        dataset = pq.ParquetDataset(
            path,
            filesystem=self.fs,
            filters=partition_filters
        )
        
        table = dataset.read(columns=columns)
        return table.to_pandas()
    
    def write_efficient(
        self,
        df: pd.DataFrame,
        key: str,
        partition_cols: Optional[List[str]] = None
    ):
        """Efficiently write DataFrame to S3"""
        path = f"s3://{self.bucket}/{self.prefix}{key}"
        
        # Convert to PyArrow table
        table = pa.Table.from_pandas(df)
        
        # Write with partitioning
        pq.write_to_dataset(
            table,
            path,
            filesystem=self.fs,
            partition_cols=partition_cols,
            compression='snappy'
        )
```

### Azure Integration
```python
from azure.storage.blob import BlobServiceClient
import pyarrow.dataset as ds

class AzureDataFrameManager:
    """Azure-optimized DataFrame operations"""
    
    def __init__(self, connection_string: str, container: str):
        self.blob_service = BlobServiceClient.from_connection_string(
            connection_string
        )
        self.container = container
    
    def read_partitioned(
        self,
        path: str,
        partition_filters: Optional[dict] = None
    ) -> pd.DataFrame:
        """Read partitioned data from Azure Blob Storage"""
        dataset = ds.dataset(
            f"az://{self.container}/{path}",
            format='parquet',
            partitioning=ds.DirectoryPartitioning()
        )
        
        # Apply partition filters
        if partition_filters:
            filter_expr = None
            for col, value in partition_filters.items():
                expr = ds.field(col) == value
                filter_expr = expr if filter_expr is None else filter_expr & expr
            
            dataset = dataset.filter(filter_expr)
        
        return dataset.to_table().to_pandas()
```

### Cloud-Optimized Operations
```python
from concurrent.futures import ThreadPoolExecutor
import numpy as np

class CloudOptimizedOperations:
    """Operations optimized for cloud environments"""
    
    @staticmethod
    def parallel_transform(
        df: pd.DataFrame,
        func: callable,
        n_threads: int = None
    ) -> pd.DataFrame:
        """Parallel transformation optimized for cloud"""
        if n_threads is None:
            n_threads = min(32, cpu_count() * 2)
        
        chunks = np.array_split(df, n_threads)
        
        with ThreadPoolExecutor(max_workers=n_threads) as executor:
            results = list(executor.map(func, chunks))
        
        return pd.concat(results)
    
    @staticmethod
    def optimize_for_cloud(df: pd.DataFrame) -> pd.DataFrame:
        """Optimize DataFrame for cloud storage"""
        # Convert string columns to PyArrow
        for col in df.select_dtypes(['object']):
            df[col] = df[col].astype('string[pyarrow]')
        
        # Optimize numeric types
        for col in df.select_dtypes(['int']):
            if df[col].min() >= 0:
                if df[col].max() < 255:
                    df[col] = df[col].astype('uint8')
                elif df[col].max() < 65535:
                    df[col] = df[col].astype('uint16')
                elif df[col].max() < 4294967295:
                    df[col] = df[col].astype('uint32')
        
        return df
```

## Advanced Benchmarking and Optimization

### Performance Benchmarking Framework
```python
from dataclasses import dataclass
import time
import psutil
import pandas as pd
from typing import Callable, Dict, Any, List
import numpy as np

@dataclass
class BenchmarkResult:
    operation: str
    duration: float
    memory_used: float
    cpu_usage: float
    rows_processed: int
    
    @property
    def rows_per_second(self) -> float:
        return self.rows_processed / self.duration if self.duration > 0 else 0

class PandasBenchmark:
    """Comprehensive benchmarking framework for pandas operations"""
    
    def __init__(self):
        self.results: List[BenchmarkResult] = []
    
    def benchmark(
        self,
        operation: str,
        func: Callable,
        *args,
        repeat: int = 3,
        **kwargs
    ) -> BenchmarkResult:
        """Benchmark a pandas operation"""
        durations = []
        memory_usages = []
        cpu_usages = []
        
        for _ in range(repeat):
            # Clear memory
            import gc
            gc.collect()
            
            start_memory = psutil.Process().memory_info().rss
            start_time = time.perf_counter()
            start_cpu = psutil.cpu_percent()
            
            result = func(*args, **kwargs)
            
            end_cpu = psutil.cpu_percent()
            end_time = time.perf_counter()
            end_memory = psutil.Process().memory_info().rss
            
            durations.append(end_time - start_time)
            memory_usages.append(end_memory - start_memory)
            cpu_usages.append((start_cpu + end_cpu) / 2)
        
        # Calculate results
        benchmark_result = BenchmarkResult(
            operation=operation,
            duration=np.mean(durations),
            memory_used=np.mean(memory_usages) / (1024 * 1024),  # MB
            cpu_usage=np.mean(cpu_usages),
            rows_processed=len(result) if isinstance(result, pd.DataFrame) else 0
        )
        
        self.results.append(benchmark_result)
        return benchmark_result
    
    def compare_implementations(
        self,
        implementations: Dict[str, Callable],
        data: pd.DataFrame,
        **kwargs
    ) -> pd.DataFrame:
        """Compare different implementations"""
        results = []
        
        for name, func in implementations.items():
            result = self.benchmark(name, func, data, **kwargs)
            results.append({
                'implementation': name,
                'duration_seconds': result.duration,
                'memory_mb': result.memory_used,
                'cpu_percent': result.cpu_usage,
                'rows_per_second': result.rows_per_second
            })
        
        return pd.DataFrame(results)
```

### Modern Integration Patterns

#### Polars Integration
```python
import polars as pl
from typing import Callable, Optional

class PolarsOptimizer:
    """Optimize pandas operations using Polars"""
    
    @staticmethod
    def optimize_operation(
        df: pd.DataFrame,
        operation: Callable,
        use_streaming: bool = False
    ) -> pd.DataFrame:
        """Execute pandas operation through Polars"""
        # Convert to Polars
        pl_df = pl.from_pandas(df)
        
        if use_streaming:
            pl_df = pl_df.lazy()
        
        # Apply operation
        result = operation(pl_df)
        
        # Convert back to pandas
        return result.collect().to_pandas() if use_streaming else result.to_pandas()
    
    @staticmethod
    def optimize_groupby(
        df: pd.DataFrame,
        group_cols: List[str],
        agg_dict: Dict[str, List[str]]
    ) -> pd.DataFrame:
        """Optimized groupby using Polars"""
        pl_df = pl.from_pandas(df)
        
        # Convert pandas agg dict to Polars expressions
        agg_exprs = []
        for col, aggs in agg_dict.items():
            for agg in aggs:
                if agg == 'mean':
                    agg_exprs.append(pl.col(col).mean().alias(f"{col}_mean"))
                elif agg == 'sum':
                    agg_exprs.append(pl.col(col).sum().alias(f"{col}_sum"))
                elif agg == 'count':
                    agg_exprs.append(pl.col(col).count().alias(f"{col}_count"))
        
        return pl_df.groupby(group_cols).agg(agg_exprs).to_pandas()
```

#### DuckDB Integration
```python
import duckdb
from typing import Optional

class DuckDBOptimizer:
    """Optimize pandas operations using DuckDB"""
    
    def __init__(self, memory_limit: str = '8GB'):
        self.con = duckdb.connect()
        self.con.execute(f"SET memory_limit='{memory_limit}'")
    
    def optimize_query(
        self,
        df: pd.DataFrame,
        query: str,
        params: Optional[Dict[str, Any]] = None
    ) -> pd.DataFrame:
        """Execute SQL query on pandas DataFrame using DuckDB"""
        self.con.register('df', df)
        
        if params:
            return self.con.execute(query, params).df()
        return self.con.execute(query).df()
    
    def optimize_join(
        self,
        left: pd.DataFrame,
        right: pd.DataFrame,
        on: List[str],
        how: str = 'inner'
    ) -> pd.DataFrame:
        """Optimize DataFrame join using DuckDB"""
        self.con.register('left', left)
        self.con.register('right', right)
        
        join_type = {
            'inner': 'INNER',
            'left': 'LEFT',
            'right': 'RIGHT',
            'outer': 'FULL OUTER'
        }.get(how, 'INNER')
        
        query = f"""
        SELECT * FROM left
        {join_type} JOIN right
        USING ({','.join(on)})
        """
        
        return self.con.execute(query).df()
```

### Modern Data Types and Operations

#### Arrow Data Types
```python
import pyarrow as pa
from pandas.api.types import is_numeric_dtype

class ArrowOptimizer:
    """Optimize DataFrame using Arrow data types"""
    
    @staticmethod
    def optimize_dtypes(df: pd.DataFrame) -> pd.DataFrame:
        """Convert DataFrame to optimal Arrow types"""
        df = df.copy()
        
        # String columns to Arrow string type
        for col in df.select_dtypes(['object']):
            df[col] = df[col].astype('string[pyarrow]')
        
        # Numeric columns to appropriate Arrow types
        for col in df.select_dtypes(['int', 'float']):
            if is_numeric_dtype(df[col]):
                if df[col].isnull().any():
                    # Use Arrow nullable types
                    if df[col].dtype.kind == 'i':
                        df[col] = df[col].astype('Int64')
                    else:
                        df[col] = df[col].astype('Float64')
        
        return df
    
    @staticmethod
    def create_arrow_schema(df: pd.DataFrame) -> pa.Schema:
        """Create optimized Arrow schema for DataFrame"""
        fields = []
        
        for col in df.columns:
            if df[col].dtype == 'string[pyarrow]':
                field = pa.field(col, pa.string())
            elif df[col].dtype == 'Int64':
                field = pa.field(col, pa.int64())
            elif df[col].dtype == 'Float64':
                field = pa.field(col, pa.float64())
            else:
                # Default to double for other numeric types
                field = pa.field(col, pa.float64())
            
            fields.append(field)
        
        return pa.schema(fields)
```

### Troubleshooting Guide

#### Common Issues and Solutions
```python
class PandasTroubleshooter:
    """Troubleshooting utilities for pandas operations"""
    
    @staticmethod
    def diagnose_memory_issue(df: pd.DataFrame) -> Dict[str, Any]:
        """Diagnose memory usage issues"""
        diagnosis = {
            'total_memory_mb': df.memory_usage(deep=True).sum() / (1024 * 1024),
            'column_memory': {},
            'recommendations': []
        }
        
        for col in df.columns:
            mem_usage = df[col].memory_usage(deep=True) / (1024 * 1024)
            diagnosis['column_memory'][col] = {
                'memory_mb': mem_usage,
                'dtype': str(df[col].dtype)
            }
            
            # Generate recommendations
            if df[col].dtype == 'object':
                diagnosis['recommendations'].append(
                    f"Convert {col} to 'string[pyarrow]' or 'category'"
                )
            elif df[col].dtype == 'float64':
                if df[col].isnull().sum() == 0:
                    diagnosis['recommendations'].append(
                        f"Convert {col} to 'float32' if precision allows"
                    )
        
        return diagnosis
    
    @staticmethod
    def diagnose_performance_issue(
        df: pd.DataFrame,
        operation: Callable,
        *args,
        **kwargs
    ) -> Dict[str, Any]:
        """Diagnose performance issues"""
        diagnosis = {
            'operation_profile': {},
            'recommendations': []
        }
        
        # Profile operation
        start_time = time.perf_counter()
        start_memory = psutil.Process().memory_info().rss
        
        result = operation(df, *args, **kwargs)
        
        end_time = time.perf_counter()
        end_memory = psutil.Process().memory_info().rss
        
        diagnosis['operation_profile'] = {
            'duration_seconds': end_time - start_time,
            'memory_increase_mb': (end_memory - start_memory) / (1024 * 1024)
        }
        
        # Generate recommendations
        if end_time - start_time > 1.0:
            diagnosis['recommendations'].append(
                "Consider using parallel processing or chunking"
            )
        
        if (end_memory - start_memory) / (1024 * 1024) > 1000:
            diagnosis['recommendations'].append(
                "Consider using memory-efficient data types or streaming"
            )
        
        return diagnosis
```

## Appendix: Troubleshooting Guide

### Quick Reference: Performance Issues

#### 1. Memory Spikes
```python
# Problem: Memory usage suddenly increases
df['column'] = df['column'].apply(some_function)  # Bad

# Solution 1: Use vectorized operations
df['column'] = some_function(df['column'].values)  # Good

# Solution 2: Process in chunks
chunk_size = 10000
for i in range(0, len(df), chunk_size):
    df.iloc[i:i+chunk_size, df.columns.get_loc('column')] = \
        some_function(df.iloc[i:i+chunk_size]['column'].values)
```

#### 2. Slow Operations
```python
# Problem: Slow string operations
df['text'] = df['text'].str.lower()  # Can be slow

# Solution: Use PyArrow string operations
df['text'] = df['text'].astype('string[pyarrow]').str.lower()  # Faster

# Problem: Slow groupby operations
result = df.groupby('category')['value'].mean()  # Can be slow

# Solution: Use optimized groupby
df = df.sort_values('category')  # Pre-sort for better performance
result = df.groupby('category')['value'].mean()
```

### Common Anti-Patterns and Fixes

#### 1. DataFrame Creation
```python
# Anti-pattern: Growing a DataFrame
df = pd.DataFrame(columns=['A', 'B'])
for i in range(1000000):
    df.loc[i] = [i, i*2]  # Very slow

# Fix: Pre-allocate or use list comprehension
data = [[i, i*2] for i in range(1000000)]
df = pd.DataFrame(data, columns=['A', 'B'])
```

#### 2. Data Access
```python
# Anti-pattern: Iterating over DataFrame
for index, row in df.iterrows():  # Slow
    process_row(row)

# Fix: Use vectorization
df.apply(process_row, axis=1)  # Better
# Or even better:
df.assign(result=process_row(df))  # Best
```

### Quick Solutions for Common Tasks

#### 1. Memory Optimization
```python
def quick_memory_fix(df: pd.DataFrame) -> pd.DataFrame:
    """Quick memory optimization for common cases"""
    # Optimize strings
    obj_cols = df.select_dtypes(['object']).columns
    df[obj_cols] = df[obj_cols].astype('string[pyarrow]')
    
    # Optimize integers
    int_cols = df.select_dtypes(['int64']).columns
    df[int_cols] = df[int_cols].astype('int32')
    
    # Optimize floats
    float_cols = df.select_dtypes(['float64']).columns
    df[float_cols] = df[float_cols].astype('float32')
    
    return df
```

#### 2. Performance Optimization
```python
def quick_performance_fix(df: pd.DataFrame) -> pd.DataFrame:
    """Quick performance optimization for common operations"""
    # Sort index for better performance
    if isinstance(df.index, pd.DatetimeIndex) and not df.index.is_monotonic_increasing:
        df = df.sort_index()
    
    # Convert categorical columns
    for col in df.select_dtypes(['object']):
        if df[col].nunique() / len(df) < 0.1:  # Less than 10% unique
            df[col] = df[col].astype('category')
    
    return df
```

### Emergency Fixes

#### 1. Memory Emergency
```python
def emergency_memory_reduction(df: pd.DataFrame) -> pd.DataFrame:
    """Emergency memory reduction - use when memory errors occur"""
    # Convert all strings to categorical
    for col in df.select_dtypes(['object']):
        df[col] = df[col].astype('category')
    
    # Downcast all numerics
    for col in df.select_dtypes(['int']):
        df[col] = pd.to_numeric(df[col], downcast='integer')
    for col in df.select_dtypes(['float']):
        df[col] = pd.to_numeric(df[col], downcast='float')
    
    # Force garbage collection
    import gc
    gc.collect()
    
    return df
```

#### 2. Performance Emergency
```python
def emergency_performance_boost(df: pd.DataFrame) -> pd.DataFrame:
    """Emergency performance optimization"""
    # Switch to DuckDB for operations
    import duckdb
    
    # Register DataFrame with DuckDB
    duckdb.register('df', df)
    
    # Perform operations using SQL
    result = duckdb.sql("""
        SELECT *
        FROM df
        WHERE /* your conditions */
        GROUP BY /* your grouping */
    """).df()
    
    return result
```

### Quick Reference: Best Methods by Task

#### 1. Data Loading
```python
# Best practices for different file types
def load_optimized(file_path: str) -> pd.DataFrame:
    """Optimized data loading based on file type"""
    if file_path.endswith('.csv'):
        return pd.read_csv(
            file_path,
            dtype_backend='pyarrow',
            engine='pyarrow'
        )
    elif file_path.endswith('.parquet'):
        return pd.read_parquet(
            file_path,
            engine='pyarrow'
        )
    elif file_path.endswith('.feather'):
        return pd.read_feather(
            file_path,
            memory_map=True
        )
```

#### 2. Data Export
```python
def save_optimized(df: pd.DataFrame, file_path: str):
    """Optimized data saving based on file type"""
    if file_path.endswith('.parquet'):
        df.to_parquet(
            file_path,
            engine='pyarrow',
            compression='snappy'
        )
    elif file_path.endswith('.feather'):
        df.to_feather(
            file_path,
            compression='lz4'
        )
    elif file_path.endswith('.csv'):
        df.to_csv(
            file_path,
            index=False,
            compression='zip'
        )
```

### Performance Checklist

1. **Data Types**
   - [ ] String columns using PyArrow
   - [ ] Appropriate numeric types
   - [ ] Categorical for low-cardinality
   - [ ] Datetime index if time series

2. **Operations**
   - [ ] Vectorized operations used
   - [ ] Avoid DataFrame copies
   - [ ] Pre-sort for groupby
   - [ ] Use appropriate index

3. **Memory**
   - [ ] Monitor memory usage
   - [ ] Clean up temporary objects
   - [ ] Use chunking for large data
   - [ ] Implement garbage collection

4. **Integration**
   - [ ] Use appropriate engine
   - [ ] Optimize storage format
   - [ ] Consider distributed processing
   - [ ] Monitor performance

### Final Tips

1. **Always Profile First**
   - Use memory_profiler
   - Monitor operation times
   - Check CPU usage
   - Identify bottlenecks

2. **Choose Right Tools**
   - pandas for medium data
   - dask for big data
   - polars for speed
   - DuckDB for SQL operations

3. **Monitor Production**
   - Track memory usage
   - Log operation times
   - Monitor error rates
   - Check resource utilization