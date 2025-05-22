# PyUpgrade Rules Guide (UP)

PyUpgrade rules focus on upgrading Python code to use newer syntax features and patterns introduced in newer Python versions. This guide details each rule with examples and historical context.

## Overview

pyupgrade is a tool designed to automatically upgrade syntax for newer versions of Python. The rules help modernize code while maintaining compatibility. Ruff implements these rules as the UP category.

## Table of Contents

1. [Basic Language Features](#basic-language-features)
2. [Type System Improvements](#type-system-improvements)
3. [Modern Syntax Patterns](#modern-syntax-patterns)
4. [Format String Upgrades](#format-string-upgrades)
5. [Deprecated Features Removal](#deprecated-features-removal)

## Basic Language Features

### UP001: Useless metaclass=type

**Background**: Python 3 unified the class model, making `__metaclass__ = type` unnecessary since all classes are "new-style" classes.

**Python Version**: Introduced in Python 3.0 (PEP 3115)  
**PEP Reference**: [PEP 3115 -- Metaclasses in Python 3000](https://www.python.org/dev/peps/pep-3115/)

Before:
```python
class MyClass:
    __metaclass__ = type
    
    def my_method(self):
        pass
```

After:
```python
class MyClass:
    def my_method(self):
        pass
```

### UP004: Useless object inheritance

**Background**: In Python 3, all classes implicitly inherit from `object`, making explicit inheritance redundant.

**Python Version**: Python 3.0  
**PEP Reference**: [PEP 3119 -- Introducing Abstract Base Classes](https://www.python.org/dev/peps/pep-3119/)

Before:
```python
class MyClass(object):
    pass

class AnotherClass(object):
    def __init__(self):
        super(AnotherClass, self).__init__()
```

After:
```python
class MyClass:
    pass

class AnotherClass:
    def __init__(self):
        super().__init__()
```

## Type System Improvements

### UP006: Non-PEP 585 Annotation

**Background**: PEP 585 introduced the ability to use built-in collection types in annotations, replacing the need for typing module equivalents.

**Python Version**: Python 3.9+  
**PEP Reference**: [PEP 585 -- Type Hinting Generics In Standard Collections](https://www.python.org/dev/peps/pep-0585/)

Before:
```python
from typing import List, Dict, Tuple, Set

def process_data(items: List[str]) -> Dict[str, Tuple[int, Set[str]]]:
    pass
```

After:
```python
def process_data(items: list[str]) -> dict[str, tuple[int, set[str]]]:
    pass
```

### UP007: Non-PEP 604 Union Types

**Background**: PEP 604 introduced a more concise syntax for union types using the | operator.

**Python Version**: Python 3.10+  
**PEP Reference**: [PEP 604 -- Allow writing union types as X | Y](https://www.python.org/dev/peps/pep-0604/)

Before:
```python
from typing import Union, Optional

def process_value(x: Union[int, str]) -> Optional[float]:
    pass
```

After:
```python
def process_value(x: int | str) -> float | None:
    pass
```

## Modern Syntax Patterns

### UP008: Super call with parameters

**Background**: Python 3 simplified super() calls by making the class and instance arguments optional.

**Python Version**: Python 3.0  
**PEP Reference**: [PEP 3135 -- New Super](https://www.python.org/dev/peps/pep-3135/)

Before:
```python
class MyClass(Parent):
    def __init__(self):
        super(MyClass, self).__init__()
```

After:
```python
class MyClass(Parent):
    def __init__(self):
        super().__init__()
```

### UP011: LRU Cache without parameters

**Background**: Python 3.8 simplified @lru_cache usage when no parameters are needed.

**Python Version**: Python 3.8  
**PEP Reference**: [PEP 589 -- TypedDict: Type Hints for Dictionaries with a Fixed Set of Keys](https://www.python.org/dev/peps/pep-0589/)

Before:
```python
from functools import lru_cache

@lru_cache()
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

After:
```python
from functools import lru_cache

@lru_cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## Format String Upgrades

### UP031: Use f-strings instead of % formatting

**Background**: Python 3.6 introduced f-strings, providing a more readable and maintainable way to format strings.

**Python Version**: Python 3.6+  
**PEP Reference**: [PEP 498 -- Literal String Interpolation](https://www.python.org/dev/peps/pep-0498/)

Before:
```python
name = "World"
greeting = "Hello, %s!" % name

values = {'name': 'World', 'count': 3}
message = "Hello, %(name)s! Count: %(count)d" % values
```

After:
```python
name = "World"
greeting = f"Hello, {name}!"

values = {'name': 'World', 'count': 3}
message = f"Hello, {values['name']}! Count: {values['count']}"
```

### UP032: f-string instead of .format()

**Background**: f-strings are more readable and often more performant than .format() calls.

**Python Version**: Python 3.6+  
**PEP Reference**: [PEP 498 -- Literal String Interpolation](https://www.python.org/dev/peps/pep-0498/)

Before:
```python
name = "World"
age = 25
greeting = "Hello, {}! You are {} years old.".format(name, age)
greeting_named = "Hello, {name}! You are {age} years old.".format(name=name, age=age)
```

After:
```python
name = "World"
age = 25
greeting = f"Hello, {name}! You are {age} years old."
greeting_named = f"Hello, {name}! You are {age} years old."
```

## Deprecated Features Removal

### UP023: Replace cElementTree with ElementTree

**Background**: cElementTree was deprecated as ElementTree now provides similar performance.

**Python Version**: Python 3.3+  
**PEP Reference**: N/A (Implementation Detail)

Before:
```python
try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET
```

After:
```python
import xml.etree.ElementTree as ET
```

### UP026: Replace mock with unittest.mock

**Background**: The `mock` package was integrated into the standard library as `unittest.mock`.

**Python Version**: Python 3.3+  
**PEP Reference**: N/A (Standard Library Change)

Before:
```python
from mock import Mock, patch

@patch('module.function')
def test_function(mock_func):
    mock_func.return_value = 42
```

After:
```python
from unittest.mock import Mock, patch

@patch('module.function')
def test_function(mock_func):
    mock_func.return_value = 42
```

## Historical Context

The evolution of Python's syntax and features has been driven by the need to make the language more expressive, maintainable, and performant. Key milestones include:

1. **Python 3.0 (2008)**:
   - Unified class model
   - New-style classes by default
   - Simplified super() calls
   - Abstract Base Classes

2. **Python 3.6 (2016)**:
   - f-strings introduction
   - Underscores in numeric literals
   - Annotations for variables

3. **Python 3.9 (2020)**:
   - Generic type annotations
   - Dictionary union operators
   - Removals of deprecated features

4. **Python 3.10 (2021)**:
   - Pattern matching
   - Union types using |
   - ParamSpec and TypeVarTuple

These changes have significantly improved Python's readability and reduced common sources of bugs, while maintaining the language's simplicity and expressiveness.

## References

1. [Python Enhancement Proposals (PEPs)](https://www.python.org/dev/peps/)
2. [What's New In Python 3.0](https://docs.python.org/3/whatsnew/3.0.html)
3. [Python Type Hints](https://docs.python.org/3/library/typing.html)
4. [Ruff Documentation - pyupgrade rules](https://docs.astral.sh/ruff/rules/#pyupgrade-up)
