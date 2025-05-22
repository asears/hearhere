# VS Code Refactoring Guide

## Reducing Cognitive Complexity

### 1. Extract Method Pattern
```python
# Before
def process_user_data(user_data):
    if user_data.get('age') and int(user_data['age']) >= 18:
        if user_data.get('country') in ['US', 'CA']:
            if user_data.get('subscription') == 'premium':
                # Complex logic here
                pass

# After
def is_eligible_age(age: str) -> bool:
    return age and int(age) >= 18

def is_supported_country(country: str) -> bool:
    return country in ['US', 'CA']

def process_user_data(user_data: dict) -> None:
    if (is_eligible_age(user_data.get('age')) and 
        is_supported_country(user_data.get('country')) and 
        user_data.get('subscription') == 'premium'):
        # Complex logic here
        pass
```

### 2. Replace Nested Conditionals with Guard Clauses
```python
# Before
def process_order(order):
    if order:
        if order.items:
            if order.payment:
                process_payment(order.payment)
                return True
    return False

# After
def process_order(order):
    if not order:
        return False
    if not order.items:
        return False
    if not order.payment:
        return False
    
    process_payment(order.payment)
    return True
```

## Parameter Reduction Techniques

### 1. Use Parameter Objects
```python
# Before
def create_user(name: str, email: str, age: int, country: str,
                subscription: str, preferences: dict):
    # Complex user creation logic

# After
from dataclasses import dataclass

@dataclass
class UserCreationParams:
    name: str
    email: str
    age: int
    country: str
    subscription: str
    preferences: dict

def create_user(params: UserCreationParams):
    # Complex user creation logic
```

### 2. Method Chaining
```python
# Before
def process_data(data):
    filtered = filter_data(data)
    transformed = transform_data(filtered)
    validated = validate_data(transformed)
    return save_data(validated)

# After
from dataclasses import dataclass

@dataclass
class DataProcessor:
    data: any
    
    def filter(self):
        self.data = filter_data(self.data)
        return self
        
    def transform(self):
        self.data = transform_data(self.data)
        return self
        
    def validate(self):
        self.data = validate_data(self.data)
        return self
        
    def save(self):
        return save_data(self.data)

# Usage
result = (DataProcessor(data)
          .filter()
          .transform()
          .validate()
          .save())
```

## VS Code Refactoring Tools

### 1. Built-in Refactoring Commands
- `F2`: Rename symbol
- `Ctrl+.`: Quick fixes and refactorings
- `Shift+Alt+F`: Format document
- `Ctrl+K Ctrl+F`: Format selection

### 2. Python-specific Extensions
- **Pylance**
  - Type checking
  - Import organization
  - Code actions for common patterns

- **Python Refactor**
  - Extract method/variable
  - Move symbol
  - Convert function to method

### 3. GitHub Copilot Refactoring

#### Using Copilot Chat
```python
# Type /refactor followed by description
/refactor simplify this complex method by breaking it into smaller functions

# Ask for specific refactoring patterns
/explain how to apply the Strategy pattern to this code

# Get suggestions for reducing complexity
/improve reduce the cognitive complexity of this method
```

#### Using Inline Suggestions
- Add a comment describing desired refactoring
- Let Copilot suggest improved implementations
- Use `Alt+]` and `Alt+[` to cycle through suggestions

## Code Smell Detection

### 1. Long Method Detection
```python
def is_method_too_long(method_body: str) -> bool:
    lines = method_body.split('\n')
    non_empty_lines = [line for line in lines if line.strip()]
    return len(non_empty_lines) > 20  # Configurable threshold
```

### 2. Parameter Count Warning
```python
def warn_too_many_params(func):
    def wrapper(*args, **kwargs):
        if len(args) + len(kwargs) > 5:  # Configurable threshold
            warnings.warn(f"Function {func.__name__} has too many parameters")
        return func(*args, **kwargs)
    return wrapper
```

## Best Practices

### 1. Single Responsibility Principle
```python
# Before
class UserManager:
    def create_user(self): pass
    def send_email(self): pass
    def generate_report(self): pass

# After
class UserManager:
    def create_user(self): pass

class EmailService:
    def send_email(self): pass

class ReportGenerator:
    def generate_report(self): pass
```

### 2. Dependency Injection
```python
# Before
class OrderProcessor:
    def process(self, order):
        payment_service = PaymentService()
        payment_service.process_payment(order)

# After
class OrderProcessor:
    def __init__(self, payment_service: PaymentService):
        self.payment_service = payment_service
    
    def process(self, order):
        self.payment_service.process_payment(order)
```

### 3. Use Type Hints
```python
from typing import List, Optional, Dict, Any

def process_items(
    items: List[Dict[str, Any]],
    config: Optional[Dict[str, str]] = None
) -> List[Dict[str, Any]]:
    """
    Process a list of items based on optional configuration.
    
    Args:
        items: List of dictionaries containing item data
        config: Optional configuration dictionary
        
    Returns:
        Processed items as a list of dictionaries
    """
    pass
```
