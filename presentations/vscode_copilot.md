# VS Code Copilot Tips and Tricks

## Python Symbol Understanding

### What is a Symbol in Python?
A symbol in Python refers to any named entity in your code, including:
- Variables
- Functions
- Classes
- Methods
- Modules
- Package names

## Working with Symbols in Copilot

### Symbol Navigation
1. Use `//@` in Copilot Chat to reference specific symbols
2. Use `#` to search symbols across workspace
3. Use `Ctrl+T` to quickly navigate to symbols

### Symbol Debugging Tips
1. **Hover Information**
   - Hover over any symbol to see its type and documentation
   - Copilot enhances hover information with additional context

2. **Go to Definition**
   - `F12` or `Ctrl+Click` on a symbol
   - Use "Peek Definition" (`Alt+F12`) to view inline

3. **Find All References**
   - `Shift+F12` to see all uses of a symbol
   - Helpful for understanding symbol usage patterns

## Copilot Advanced Features

### Code Generation
- Start with a comment describing the desired functionality
- Use natural language to describe complex operations
- Reference existing symbols in your comments for context

### Contextual Suggestions
- Copilot learns from your open files and symbol usage
- Provides more relevant suggestions based on your codebase
- Adapts to your coding style and patterns

### Documentation Generation
```python
# Example: Let Copilot document your function
# Type: "##" above your function and wait for suggestion
def process_data(input_data: list) -> dict:
    # Copilot will suggest comprehensive docstring
    pass
```

### Testing Support
- Generate unit tests by commenting test scenarios
- Copilot understands pytest and unittest frameworks
- Can suggest test cases based on function parameters

## Best Practices

### Symbol Organization
1. Keep symbol names descriptive and consistent
2. Use type hints for better Copilot suggestions
3. Organize related symbols in modules

### Debugging with Copilot
1. Ask Copilot to explain complex code sections
2. Use Copilot to suggest debugging strategies
3. Generate logging statements for better debugging

### Code Review
1. Ask Copilot to review code blocks
2. Get suggestions for code improvements
3. Check for common anti-patterns

## Common Shortcuts for Symbol Work
- `Ctrl+Space`: Trigger suggestions
- `Alt+/`: Trigger inline Copilot suggestions
- `Ctrl+I`: Open Copilot inline chat
- `Ctrl+Shift+I`: Open Copilot chat view

## Symbol-Specific Commands
1. **Find Symbol References**
   ```
   //@symbol-name find all references
   ```

2. **Explain Symbol**
   ```
   //@symbol-name explain this
   ```

3. **Improve Symbol Usage**
   ```
   //@symbol-name suggest improvements
   ```

## Tips for Better Symbol Recognition
1. Use consistent naming conventions
2. Add type hints to functions and variables
3. Keep code properly formatted
4. Use meaningful variable names
5. Document classes and functions

### Python Symbol Types and Memory Management
1. **Primitive Types**
   - Integers, floats, booleans are immutable
   - Memory allocated on creation, freed when reference count reaches 0
   - Use `sys.getsizeof()` to check memory usage
   - Example: `sys.getsizeof(42)` returns bytes used

2. **Complex Types**
   - Lists, dictionaries, custom objects are mutable
   - Memory managed by reference counting and garbage collection
   - Type hints for complex types:
   ```python
   from typing import List, Dict, Optional, Union
   
   # Complex type examples
   data: List[Dict[str, Union[str, int]]] = []
   matrix: List[List[float]] = [[1.0, 2.0], [3.0, 4.0]]
   ```

3. **Memory Debugging Tools**
   - Use `memory_profiler` decorator:
   ```python
   from memory_profiler import profile
   
   @profile
   def memory_intensive_function():
       large_list = [i for i in range(1000000)]
   ```
   - Track object references:
   ```python
   import sys
   print(sys.getrefcount(your_object))
   ```
   - Memory leak detection:
   ```python
   import tracemalloc
   tracemalloc.start()
   # Your code here
   snapshot = tracemalloc.take_snapshot()
   ```

### Memory Optimization Tips
1. **Use Generators for Large Sequences**
   ```python
   # Instead of
   large_list = [x * 2 for x in range(1000000)]
   
   # Use generator
   large_gen = (x * 2 for x in range(1000000))
   ```

2. **Proper Object Cleanup**
   ```python
   class ResourceHandler:
       def __enter__(self):
           return self
       
       def __exit__(self, exc_type, exc_val, exc_tb):
           # Cleanup code here
           pass
   ```

3. **Memory Monitoring in VS Code**
   - Install Python extension
   - Use Memory Usage tool window
   - Monitor process memory in Debug Console
