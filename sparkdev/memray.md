# Memray: Memory Profiling in Python

Memray is a powerful memory profiling tool that helps identify memory leaks and analyze memory usage patterns in Python applications. Version 1.17.1 in DBR 16.4 brings enhanced capabilities for memory debugging.

## Basic Usage

### Memory Tracking
```python
from memray import Tracker

def memory_intensive_function():
    return [i * i for i in range(1000000)]

with Tracker('memory_profile.bin'):
    result = memory_intensive_function()
```

### Generating Reports
```bash
# Generate a flamegraph
memray flamegraph memory_profile.bin

# Generate an interactive HTML report
memray flamegraph --html memory_report.html memory_profile.bin

# Generate a summary report
memray summary memory_profile.bin
```

## Advanced Usage

### Live Mode Monitoring
```python
from memray import Tracker

def analyze_data(data):
    processed = []
    with Tracker("live_analysis.bin", live_mode=True):
        for item in data:
            # Memory usage will be tracked in real-time
            processed.append(item * 2)
    return processed
```

### Memory Allocation Tracking
```python
from memray import Tracker

def track_allocations():
    with Tracker("allocations.bin", native_traces=True):
        # Track memory allocations including C extensions
        import numpy as np
        large_array = np.zeros((10000, 10000))
        del large_array
```

## Integration with pytest

### Memory Leak Detection
```python
import pytest
from memray import Tracker
import gc

@pytest.fixture
def memory_tracker():
    tracker = Tracker('test_memory.bin')
    tracker.start()
    yield tracker
    tracker.stop()
    
def test_memory_leak(memory_tracker):
    initial_memory = get_memory_usage()
    
    # Run your test
    result = process_large_dataset()
    
    # Force garbage collection
    gc.collect()
    
    final_memory = get_memory_usage()
    assert final_memory - initial_memory < 1024  # Less than 1KB difference
```

### Memory Usage Assertions
```python
import pytest
from memray import Tracker
from contextlib import contextmanager

@contextmanager
def assert_max_memory(max_mb):
    with Tracker('memory_test.bin') as tracker:
        yield
        stats = tracker.stats()
        peak_mb = stats.peak_memory / (1024 * 1024)
        assert peak_mb <= max_mb, f"Memory usage ({peak_mb}MB) exceeded limit ({max_mb}MB)"

def test_memory_efficient_processing():
    with assert_max_memory(100):  # Max 100MB
        process_large_dataset()
```

## Operational Debugging

### Continuous Memory Monitoring
```python
from memray import Tracker
import logging
import time

class MemoryMonitor:
    def __init__(self, threshold_mb=1000):
        self.threshold_mb = threshold_mb
        self.logger = logging.getLogger('memory_monitor')
    
    def monitor(self):
        with Tracker('continuous_monitor.bin', live_mode=True) as tracker:
            while True:
                stats = tracker.stats()
                current_mb = stats.current_memory / (1024 * 1024)
                
                if current_mb > self.threshold_mb:
                    self.logger.warning(f"Memory usage high: {current_mb}MB")
                    self.dump_memory_profile()
                
                time.sleep(60)  # Check every minute
    
    def dump_memory_profile(self):
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        with Tracker(f'memory_dump_{timestamp}.bin'):
            # Force garbage collection
            gc.collect()
```

### Thread-Specific Memory Analysis
```python
from memray import Tracker
import threading

def analyze_thread_memory(thread_name):
    with Tracker(f'thread_{thread_name}.bin'):
        # Thread-specific code
        large_data = process_thread_data()
        return large_data

def main():
    threads = []
    for i in range(5):
        thread = threading.Thread(
            target=analyze_thread_memory,
            args=(f"worker_{i}",)
        )
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()
```

## Memory Optimization Examples

### Identifying Memory Leaks
```python
from memray import Tracker
from collections import defaultdict
import weakref

class MemoryLeakDetector:
    def __init__(self):
        self.object_counts = defaultdict(int)
        self.tracked_objects = weakref.WeakSet()
    
    def analyze(self):
        with Tracker('leak_detection.bin'):
            for _ in range(1000):
                obj = self.potentially_leaking_function()
                self.tracked_objects.add(obj)
                self.object_counts[type(obj).__name__] += 1
            
            # Check for potential leaks
            for obj_type, count in self.object_counts.items():
                actual_count = sum(1 for obj in self.tracked_objects 
                                 if type(obj).__name__ == obj_type)
                if actual_count < count:
                    print(f"Potential leak: {count - actual_count} {obj_type} objects lost")
```

### Memory-Efficient Data Processing
```python
from memray import Tracker
import pandas as pd

def process_large_csv(filename, chunksize=10000):
    total_processed = 0
    with Tracker('csv_processing.bin', live_mode=True):
        for chunk in pd.read_csv(filename, chunksize=chunksize):
            # Process each chunk
            process_chunk(chunk)
            total_processed += len(chunk)
            
            # Force garbage collection after each chunk
            gc.collect()

def process_chunk(chunk):
    # Memory-efficient processing
    chunk_result = chunk.apply(lambda x: x * 2)
    save_results(chunk_result)
    del chunk_result  # Explicit cleanup
```

## Best Practices

1. **Regular Memory Profiling**
   - Profile during development
   - Monitor in production
   - Set up memory usage alerts

2. **Memory Leak Prevention**
   - Use context managers
   - Implement proper cleanup
   - Monitor object lifecycle

3. **Performance Optimization**
   - Use generators for large datasets
   - Implement chunked processing
   - Clean up unused objects

4. **Testing**
   - Include memory tests in CI/CD
   - Set memory usage limits
   - Monitor trending usage

## Integration with Databricks

### Notebook Memory Profiling
```python
from memray import Tracker
from IPython.display import HTML
import base64

def profile_notebook_cell():
    with Tracker('notebook_profile.bin'):
        # Your notebook cell code here
        result = process_data()
    
    # Generate HTML report
    !memray flamegraph --html report.html notebook_profile.bin
    
    # Display in notebook
    with open('report.html', 'r') as f:
        html_content = f.read()
    return HTML(html_content)
```

## Resources
- [Memray Documentation](https://bloomberg.github.io/memray/)
- [Python Memory Management](https://docs.python.org/3/c-api/memory.html)
- [Databricks Performance Guide](https://docs.databricks.com/optimizations/index.html)
- [Python Memory Profilers Comparison](https://pythonspeed.com/articles/memory-profilers/)
