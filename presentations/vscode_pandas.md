# Pandas Optimization Guide

## Pandas Timeline (2015-Present)
### 2015
- **0.16.0** (March): Multiple enhancements to merge/join operations
- **0.17.0** (October): Introduction of `pd.IntervalIndex`

### 2016
- **0.18.0** (March): Introduction of `pd.api.types`
- **0.19.0** (October): Rolling/expanding operations performance improvements

### 2017
- **0.20.0** (May): New `pd.options.mode.chained_assignment`
- **0.21.0** (October): Introduction of categorical dtype for string columns

### 2018
- **0.23.0** (May): Introduction of nullable integer data type
- **0.24.0** (December): Extension array support

### 2019
- **0.25.0** (July): Initial String array implementation
- **1.0.0** (December): Major milestone, nullable boolean type

### 2020
- **1.2.0** (December): Improved NA handling with `pd.NA`

### 2021
- **1.3.0** (July): Apache Arrow integration improvements
- **1.4.0** (October): Enhanced SQL compatibility

### 2022
- **1.5.0** (June): PyArrow string dtype support
- **1.6.0** (December): Improved memory usage for string columns

### 2023
- **2.0.0** (January): Copy-on-Write (CoW), major performance improvements
- **2.1.0** (July): PyArrow as default string dtype

### 2024
- **2.2.0**: Enhanced vectorized operations
- **2.3.0**: Improved memory management with better garbage collection

## Memory Optimization Techniques

### 1. Use Efficient Data Types
```python
# Before
df = pd.read_csv('data.csv')

# After - specify dtypes
dtypes = {
    'int_col': 'int32',      # Instead of int64
    'float_col': 'float32',  # Instead of float64
    'cat_col': 'category',   # For string columns with few unique values
    'string_col': 'string[pyarrow]'  # More efficient than object dtype
}
df = pd.read_csv('data.csv', dtype=dtypes)
```

### 2. Chunking for Large Datasets
```python
# Process large files in chunks
chunks = pd.read_csv('large_file.csv', chunksize=10000)
result = pd.concat(chunk.process() for chunk in chunks)
```

### 3. Use Numpy Arrays Where Possible
```python
# Convert to numpy for calculations
numpy_array = df.values  # or df.to_numpy()
result = np.mean(numpy_array, axis=0)
```

## Alternatives to Pandas

### 1. Polars
- Rust-based, faster than pandas
- Better memory management
- Example:
```python
import polars as pl
df = pl.read_csv("data.csv")
df.lazy().filter(pl.col("value") > 0).collect()
```

### 2. Vaex
- Out-of-memory DataFrames
- Lazy evaluation
- Memory-mapped files

### 3. Dask
- Parallel computing
- Distributed DataFrames
- Scales beyond memory

## Performance Tips

### 1. Vectorization
```python
# Slow
for i in range(len(df)):
    df.iloc[i, 'result'] = complex_calculation(df.iloc[i])

# Fast
df['result'] = df.apply(complex_calculation, axis=1)

# Even faster
df['result'] = np.vectorize(complex_calculation)(df['input'])
```

### 2. Efficient Indexing
```python
# Use .loc for label-based indexing
df.loc[condition]

# Use .iloc for integer-based indexing
df.iloc[0:1000]

# Use .at for single value access
value = df.at[index, 'column']
```

### 3. Memory Reduction
```python
# Monitor memory usage
df.memory_usage(deep=True)

# Downcast numeric columns
df_int = df.select_dtypes(include=['int']).apply(pd.to_numeric, downcast='integer')
df_float = df.select_dtypes(include=['float']).apply(pd.to_numeric, downcast='float')
```

## Validation and Error Prevention

### 1. Schema Validation
```python
import pandera as pa

schema = pa.DataFrameSchema({
    "column1": pa.Column(int, checks=pa.Check.greater_than(0)),
    "column2": pa.Column(float, nullable=True),
    "column3": pa.Column(str, checks=pa.Check.isin(['A', 'B', 'C']))
})

validated_df = schema.validate(df)
```

### 2. Type Checking
```python
from typing import TypeVar, Generic
import pandas as pd

T = TypeVar('T', bound=pd.DataFrame)

class DataFrameValidator(Generic[T]):
    def __init__(self, df: T):
        self.df = df
        
    def validate_types(self) -> bool:
        expected_types = {
            'col1': 'int64',
            'col2': 'float64',
            'col3': 'category'
        }
        return all(self.df[col].dtype == dtype 
                  for col, dtype in expected_types.items())
```
