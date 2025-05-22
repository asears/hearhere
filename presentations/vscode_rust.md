# Python-Rust Integration Guide

## Timeline of Key Tools and Releases

### Rust Timeline
- 2015: Rust 1.0 released
- 2018: Rust 2018 Edition
- 2021: Rust 2021 Edition
- 2024: Rust Foundation's major security initiatives

### Python-Rust Tools Timeline
- 2019: PyO3 1.0 released
- 2021: Ruff initial release
- 2022: Maturin 1.0 for Python packaging
- 2023: UV package installer released
- 2024: PyOxidizer improvements

## Major Python Tools Using Rust

### 1. UV - Package Installer
```toml
# pyproject.toml
[build-system]
requires = ["uv"]
build-backend = "uv.backend"
```

Benefits:
- 5-10x faster than pip
- Parallel dependency resolution
- Binary artifact caching
- Memory efficient

### 2. Ruff - Python Linter
```toml
# pyproject.toml
[tool.ruff]
line-length = 88
target-version = "py39"
select = ["E", "F", "B", "I"]
```

Performance Gains:
- 100x faster than flake8
- Memory efficient AST parsing
- Parallel file processing

### 3. Polars - Data Frame Library
```python
import polars as pl

# Rust-powered operations
df = pl.read_csv("large.csv")
result = df.lazy().filter(
    pl.col("value") > 0
).collect()
```

## Integration Patterns

### 1. PyO3 Bindings
```rust
use pyo3::prelude::*;

#[pyfunction]
fn sum_numbers(a: i64, b: i64) -> PyResult<i64> {
    Ok(a + b)
}

#[pymodule]
fn my_rust_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(sum_numbers, m)?)?;
    Ok(())
}
```

### 2. Rust Extensions
```python
# Python wrapper
from .rust_module import sum_numbers

def enhanced_sum(a: int, b: int) -> int:
    return sum_numbers(a, b)
```

## Popular Python Packages Using Rust

### 1. Cryptography
- Core operations in Rust
- CFFI interface layer
- Performance critical operations

### 2. PyInstaller
- Rust-based binary parsing
- Improved build times
- Better error handling

### 3. Black (Optional Rust)
- Experimental Rust parser
- Significant speed improvements
- Memory optimization

## Development Tools

### 1. Maturin
```toml
# Cargo.toml
[package]
name = "rust-python-example"
version = "0.1.0"

[lib]
name = "rust_python_example"
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.19", features = ["extension-module"] }
```

### 2. PyOxidizer
```python
# oxidizer.py
def make_exe():
    dist = default_python_distribution()
    policy = dist.make_python_packaging_policy()
    policy.set_resource_handling_mode("files")
    return dist
```

## Performance Comparisons

### String Processing
```python
# Pure Python
def process_strings(strings: List[str]) -> List[str]:
    return [s.lower() for s in strings]  # 1x speed

# Rust-powered (via PyO3)
from rust_string_processor import process_strings
result = process_strings(strings)  # 10-20x speed
```

### Numeric Operations
```python
# Pure Python NumPy
import numpy as np
result = np.sum(large_array)  # 1x speed

# Rust-optimized
import rust_numpy
result = rust_numpy.fast_sum(large_array)  # 2-5x speed
```

## Best Practices

### 1. Memory Management
```rust
#[pyfunction]
fn process_data(data: &PyArray1<f64>) -> PyResult<f64> {
    let rust_slice = unsafe { data.as_slice()? };
    // Zero-copy operations on Python data
    Ok(rust_slice.iter().sum())
}
```

### 2. Error Handling
```rust
#[pyfunction]
fn safe_operation(value: i64) -> PyResult<i64> {
    value.checked_add(1)
        .ok_or_else(|| PyOverflowError::new_err("Integer overflow"))
}
```

### 3. Threading Considerations
```rust
#[pyfunction]
fn parallel_process(py: Python, data: Vec<i64>) -> PyResult<i64> {
    py.allow_threads(|| {
        // Long-running Rust operation
        Ok(data.iter().sum())
    })
}
```

## Memory Management Patterns

### 1. Zero-Copy Buffer Sharing
```rust
use pyo3::prelude::*;
use numpy::PyArray1;

#[pyfunction]
fn process_numpy_array(py: Python, arr: &PyArray1<f64>) -> PyResult<()> {
    // Get raw pointer without copying
    let raw_data = arr.as_slice()?;
    // Process data in place
    Ok(())
}
```

### 2. Efficient String Handling
```rust
#[pyfunction]
fn process_strings(texts: Vec<String>) -> PyResult<Vec<String>> {
    // Rust owns the strings - no Python overhead
    let processed: Vec<String> = texts
        .into_par_iter()
        .map(|text| {
            // Process each string in parallel
            text.to_lowercase()
        })
        .collect();
    Ok(processed)
}
```

## Performance-Critical Libraries Using Rust

### 1. Cryptography
```rust
// Rust implementation
#[pyfunction]
fn fast_hash(data: &[u8]) -> PyResult<Vec<u8>> {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(data);
    Ok(hasher.finalize().to_vec())
}
```

### 2. Compression Tools
```rust
use pyo3::prelude::*;
use flate2::Compression;

#[pyfunction]
fn compress_data(data: &[u8]) -> PyResult<Vec<u8>> {
    let mut encoder = flate2::write::GzEncoder::new(
        Vec::new(),
        Compression::default()
    );
    encoder.write_all(data)?;
    Ok(encoder.finish()?)
}
```

## Advanced Integration Patterns

### 1. Async Support
```rust
use pyo3::prelude::*;
use tokio;

#[pyfunction]
fn async_process(py: Python, data: Vec<u8>) -> PyResult<&PyAny> {
    pyo3_asyncio::tokio::future_into_py(py, async move {
        // Async processing in Rust
        Ok(Python::with_gil(|py| {
            // Return result to Python
            data.into_py(py)
        }))
    })
}
```

### 2. SIMD Optimization
```rust
#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;

#[pyfunction]
fn simd_process(data: Vec<f32>) -> PyResult<Vec<f32>> {
    #[cfg(target_arch = "x86_64")]
    unsafe {
        if is_x86_feature_detected!("avx2") {
            // Use AVX2 instructions
            return process_avx2(&data);
        }
    }
    // Fallback implementation
    Ok(data.iter().map(|x| x * 2.0).collect())
}
```

## Production Monitoring

### 1. Performance Metrics
```rust
use prometheus::{Counter, Histogram, Registry};

#[pyclass]
struct RustMetrics {
    operation_counter: Counter,
    duration_histogram: Histogram,
}

#[pymethods]
impl RustMetrics {
    #[new]
    fn new() -> Self {
        // Initialize Prometheus metrics
        RustMetrics {
            operation_counter: Counter::new("operations_total", "Total operations"),
            duration_histogram: Histogram::new("duration_seconds", "Operation duration")
        }
    }
}
```

### 2. Memory Profiling
```rust
use pyo3::prelude::*;
use jemalloc_ctl::{stats, epoch};

#[pyfunction]
fn memory_stats() -> PyResult<HashMap<String, u64>> {
    // Update memory statistics
    epoch::advance().unwrap();
    
    let mut stats = HashMap::new();
    stats.insert("allocated".to_string(), stats::allocated::read().unwrap());
    stats.insert("resident".to_string(), stats::resident::read().unwrap());
    
    Ok(stats)
}
```

## Optimization Techniques

### 1. Thread Pool Management
```rust
use rayon::prelude::*;

#[pyfunction]
fn parallel_process(data: Vec<f64>) -> PyResult<Vec<f64>> {
    // Configure thread pool
    rayon::ThreadPoolBuilder::new()
        .num_threads(num_cpus::get())
        .build_global()?;
    
    // Parallel processing
    let result: Vec<f64> = data.par_iter()
        .map(|&x| expensive_computation(x))
        .collect();
        
    Ok(result)
}
```

### 2. Cache-Friendly Operations
```rust
#[pyfunction]
fn optimize_memory_access(matrix: Vec<Vec<f64>>) -> PyResult<Vec<f64>> {
    let n = matrix.len();
    let mut result = vec![0.0; n];
    
    // Cache-friendly traversal
    for chunk in matrix.chunks(64) {
        for row in chunk {
            // Process data in cache-friendly manner
        }
    }
    
    Ok(result)
}
```

## Error Handling Best Practices

### 1. Python Exception Bridge
```rust
#[derive(Debug)]
enum RustError {
    IoError(std::io::Error),
    ParseError(String),
}

impl From<RustError> for PyErr {
    fn from(err: RustError) -> PyErr {
        match err {
            RustError::IoError(e) => PyIOError::new_err(e.to_string()),
            RustError::ParseError(msg) => PyValueError::new_err(msg)
        }
    }
}
```

### 2. Panic Handling
```rust
#[pyfunction]
fn safe_operation(py: Python, input: &str) -> PyResult<String> {
    let result = std::panic::catch_unwind(|| {
        // Potentially panicking code
        process_input(input)
    });
    
    match result {
        Ok(value) => Ok(value),
        Err(_) => Err(PyRuntimeError::new_err("Rust panic occurred"))
    }
}
```

## Development Tools Integration

### 1. VS Code Configuration
```toml
# .vscode/settings.json equivalent
{
    "rust-analyzer.checkOnSave.command": "clippy",
    "rust-analyzer.cargo.features": ["pyo3/extension-module"],
    "rust-analyzer.procMacro.enable": true
}
```

### 2. Debug Configuration
```toml
# .vscode/launch.json equivalent
{
    "type": "lldb",
    "request": "launch",
    "name": "Debug Python-Rust",
    "program": "python",
    "args": ["your_script.py"],
    "cwd": "${workspaceFolder}"
}
```

## Development Environment Setup

### 1. VS Code Extensions
```json
{
    "recommendations": [
        "rust-lang.rust-analyzer",
        "ms-python.python",
        "serayuzgur.crates",
        "vadimcn.vscode-lldb",
        "tamasfe.even-better-toml"
    ]
}
```

### 2. Project Configuration
```toml
# Cargo.toml for Python-Rust projects
[package]
name = "python-rust-extension"
version = "0.1.0"
edition = "2021"

[lib]
name = "python_rust_extension"
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.19", features = ["extension-module"] }
numpy = { version = "0.19", features = ["nalgebra"] }
rayon = "1.7"
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.28", features = ["full"] }
```

### 3. Development Scripts
```python
# scripts/develop.py
import subprocess
import os
import sys

def setup_development():
    """Setup development environment"""
    # Install Rust toolchain
    subprocess.run(["rustup", "default", "stable"])
    subprocess.run(["rustup", "component", "add", "rustfmt", "clippy"])
    
    # Install Python dependencies
    subprocess.run([sys.executable, "-m", "pip", "install", "-e", ".[dev]"])

if __name__ == "__main__":
    setup_development()
```

## Profiling and Optimization

### 1. Flamegraph Generation
```rust
use flamegraph::Flamegraph;

#[pyfunction]
fn profile_operation(data: Vec<f64>) -> PyResult<()> {
    let guard = pprof::ProfilerGuard::new(100).unwrap();
    
    // Run operation
    process_data(data)?;
    
    // Generate flamegraph
    if let Ok(report) = guard.report().build() {
        let file = std::fs::File::create("flamegraph.svg")?;
        report.flamegraph(file)?;
    }
    
    Ok(())
}
```

### 2. Memory Profiling
```rust
use memory_profiler::MemoryProfile;

#[pyfunction]
fn memory_profile(data: Vec<f64>) -> PyResult<String> {
    let mut profile = MemoryProfile::new();
    
    // Start profiling
    profile.start();
    process_data(data)?;
    profile.stop();
    
    // Generate report
    Ok(profile.report())
}
```

## Integration Testing

### 1. Python Test Suite
```python
# tests/test_integration.py
import pytest
import numpy as np
from your_rust_module import process_data

def test_rust_integration():
    input_data = np.array([1.0, 2.0, 3.0])
    result = process_data(input_data)
    assert isinstance(result, np.ndarray)
    assert result.dtype == np.float64
```

### 2. Rust Test Suite
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use pyo3::Python;
    use numpy::ndarray::Array1;

    #[test]
    fn test_numpy_integration() {
        Python::with_gil(|py| {
            let array = Array1::from_vec(vec![1.0, 2.0, 3.0]);
            let py_array = array.into_pyarray(py);
            let result = process_data(py_array).unwrap();
            assert!(result.as_ref(py).is_instance::<PyArray1<f64>>());
        });
    }
}
```

## Performance Comparison Tools

### 1. Benchmarking Framework
```rust
use criterion::{criterion_group, criterion_main, Criterion};

fn benchmark_rust_vs_python(c: &mut Criterion) {
    let mut group = c.benchmark_group("Data Processing");
    
    group.bench_function("rust_implementation", |b| {
        b.iter(|| process_data_rust(black_box(&input_data)))
    });
    
    group.bench_function("python_implementation", |b| {
        Python::with_gil(|py| {
            b.iter(|| process_data_python(py, black_box(&input_data)))
        })
    });
    
    group.finish();
}

criterion_group!(benches, benchmark_rust_vs_python);
criterion_main!(benches);
```

### 2. Performance Monitoring
```rust
#[pyfunction]
fn monitor_performance(data: Vec<f64>) -> PyResult<HashMap<String, f64>> {
    let mut metrics = HashMap::new();
    
    // Time the operation
    let start = std::time::Instant::now();
    let result = process_data(data)?;
    let duration = start.elapsed();
    
    metrics.insert("duration_ms".to_string(), duration.as_millis() as f64);
    metrics.insert("throughput_items_per_sec".to_string(), 
                  result.len() as f64 / duration.as_secs_f64());
    
    Ok(metrics)
}
```

## Deployment Pipeline

### 1. Continuous Integration
```yaml
# .github/workflows/ci.yml equivalent
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ['3.8', '3.9', '3.10', '3.11']
        rust-version: [stable]

    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Set up Rust
      uses: actions-rs/toolchain@v1
      with:
        profile: minimal
        toolchain: ${{ matrix.rust-version }}
    
    - name: Run tests
      run: |
        cargo test
        pytest tests/
```

### 2. Release Automation
```python
# scripts/release.py
import subprocess
import sys
from pathlib import Path

def build_wheels():
    """Build wheels for all platforms"""
    subprocess.run([
        "maturin", "build",
        "--release",
        "--strip",
        "--universal2"  # For Mac M1/Intel
    ])

def publish():
    """Publish to PyPI"""
    subprocess.run([
        "maturin", "publish",
        "--username", "__token__",
        "--password", os.environ["PYPI_TOKEN"]
    ])

if __name__ == "__main__":
    build_wheels()
    if "--publish" in sys.argv:
        publish()
```

## Documentation Generation

### 1. API Documentation
```python
# docs/conf.py
import os
import sys
sys.path.insert(0, os.path.abspath('..'))

project = 'Python-Rust Extension'
copyright = '2024'
author = 'Your Name'

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx_rust',
    'myst_parser'
]

# Add Rust sources
rust_doc_paths = ['../target/doc']
```

### 2. Usage Examples
```python
# examples/basic_usage.py
import numpy as np
from your_rust_module import process_data

def demonstrate_basic_usage():
    """Basic usage example of Rust extension"""
    # Create sample data
    data = np.array([1.0, 2.0, 3.0])
    
    # Process using Rust implementation
    result = process_data(data)
    
    print(f"Input: {data}")
    print(f"Output: {result}")

if __name__ == "__main__":
    demonstrate_basic_usage()
```
