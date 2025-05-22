# Python-Cython Integration Guide

## Overview of Cython
Cython is a programming language that makes writing C extensions for Python as easy as writing Python itself.

## Timeline and Evolution
- 2007: Initial release as Pyrex fork
- 2012: Cython 0.16 with Python 3 support
- 2016: Cython 0.24 with improved typing
- 2020: Cython 3.0 with major optimizations
- 2023: Cython 3.0.2 with Python 3.12 support

## Major Libraries Using Cython

### 1. NumPy
```python
# Core array operations
# numpy/core/_multiarray_umath.pyx
cdef class ndarray:
    cdef _process_array(self, double[:] data):
        # Fast array operations in C
        pass
```

### 2. Pandas
```python
# pandas/_libs/index.pyx
cdef class IndexEngine:
    cdef bint _check_type(self, object val):
        # Type checking at C speed
        pass
```

### 3. SciPy
```cython
# scipy/optimize/_lbfgsb.pyx
cdef int _lbfgsb_optimize(double* x, int n):
    # Optimized numerical computations
    pass
```

## Performance Patterns

### 1. Type Declarations
```cython
# Pure Python - slow
def calculate_distance(x1, y1, x2, y2):
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5

# Cython - fast
def calculate_distance(double x1, double y1, double x2, double y2):
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
```

### 2. Memory Views
```cython
# Efficient array operations
cdef double[:, :] array_view
def process_matrix(double[:, :] data):
    cdef int i, j
    cdef double total = 0
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            total += data[i, j]
    return total
```

### 3. C-level Types
```cython
# structs and pointers
cdef struct Point:
    double x
    double y

cdef class Rectangle:
    cdef Point top_left
    cdef Point bottom_right
```

## Common Use Cases

### 1. Numerical Computations
```cython
# Fast numerical operations
cdef double sum_array(double[:] arr):
    cdef:
        int i
        double total = 0
    for i in range(arr.shape[0]):
        total += arr[i]
    return total
```

### 2. File I/O Operations
```cython
# Fast file processing
cdef class FastReader:
    cdef FILE* file_handle
    
    def __cinit__(self, str filename):
        self.file_handle = fopen(filename.encode('utf-8'), 'rb')
```

### 3. String Processing
```cython
# Efficient string handling
cdef bytes _process_string(str text):
    cdef:
        bytes encoded = text.encode('utf-8')
        char* c_string = encoded
    # Process at C level
    return encoded
```

## Integration with Python

### 1. Extension Types
```cython
# custom.pyx
cdef class FastArray:
    cdef:
        double* data
        int size
    
    def __getitem__(self, int idx):
        if idx >= self.size:
            raise IndexError("Index out of bounds")
        return self.data[idx]
```

### 2. Python Wrappers
```python
# wrapper.py
from custom import FastArray

class UserFriendlyArray:
    def __init__(self, size):
        self._fast_array = FastArray(size)
```

## Performance Optimization Examples

### 1. Loop Optimization
```cython
# Slow Python loop
def python_sum(list data):
    return sum(x * x for x in data)

# Fast Cython loop
def cython_sum(double[:] data):
    cdef:
        double total = 0
        int i
    for i in range(data.shape[0]):
        total += data[i] * data[i]
    return total
```

### 2. Numpy Integration
```cython
cimport numpy as np

def fast_operation(np.ndarray[np.float64_t, ndim=2] array):
    cdef:
        int rows = array.shape[0]
        int cols = array.shape[1]
        double total = 0
    # Fast array operations
```

### 3. Memory Management
```cython
from libc.stdlib cimport malloc, free

cdef class MemoryManager:
    cdef double* data
    
    def __cinit__(self, size_t size):
        self.data = <double*>malloc(size * sizeof(double))
        if not self.data:
            raise MemoryError()
    
    def __dealloc__(self):
        if self.data:
            free(self.data)
```

## Best Practices

### 1. Type Declarations
- Use `cdef` for C-level functions
- Declare types for performance-critical variables
- Use memory views for array operations

### 2. Error Handling
```cython
cdef int c_function() except -1:
    # C-level error handling
    if error_condition:
        raise ValueError("Error message")
    return 0
```

### 3. Profiling and Optimization
```python
# Use cProfile for Python code
import cProfile
cProfile.run('function_to_profile()')

# Use Cython profiling
# cython: profile=True
cdef int profiled_function():
    pass
```

## Building Cython Projects

### pyproject.toml Configuration
```toml
[build-system]
requires = ["setuptools", "wheel", "Cython"]
build-backend = "setuptools.build_meta"

[tool.cython]
language_level = "3"
```

### setup.py Example
```python
from setuptools import setup
from Cython.Build import cythonize
import numpy as np

setup(
    ext_modules=cythonize("fast_ops.pyx"),
    include_dirs=[np.get_include()]
)
```
