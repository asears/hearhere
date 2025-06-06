# GenAIScript Prompt Variables Guide

## Overview

Prompt variables are a core feature of GenAIScript that enable dynamic content insertion, data extraction, and format transformation in prompts. This guide covers the usage of variables across different data sources and formats.

## Basic Variable Usage

### Template Literals
```javascript
const name = "World"
$`Hello ${name}!`
```

### Context Definition
```javascript
def("NAME", "World")
$`Hello {{NAME}}!`
```

### Environment Variables
```javascript
$`Today is ${env.date}`
```

## Data Source Variables

### File Content
```javascript
// Automatic text extraction
def("PDF", env.files, { endsWith: ".pdf" })

// Parsed data access
const { pages } = await parsers.PDF(env.files[0])
def("CONTENT", pages)
```

### Document Types

1. **PDF Documents**
```javascript
// Read PDF with metadata
const { pages, metadata } = await parsers.PDF("doc.pdf")
def("DOC", pages)
def("META", metadata)
```

2. **Word Documents**
```javascript
// Extract DOCX content
const { text, paragraphs } = await parsers.DOCX("doc.docx")
def("TEXT", text)
def("PARAS", paragraphs)
```

3. **Markdown Files**
```javascript
// Parse markdown with frontmatter
const { content, frontmatter } = await parsers.MD("doc.md")
def("CONTENT", content)
def("META", frontmatter)
```

4. **Images**
```javascript
// Process images with options
defImages(images, { 
  autoCrop: true,
  details: "low"
})
```

5. **Video Files**
```javascript
// Extract video frames
const frames = await ffmpeg.extractFrames(video, { 
  count: 10 
})
defImages(frames)
```

## Data Transformation

### JSON Data
```javascript
// Define schema
const schema = defSchema("DATA", {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      value: { type: "number" }
    }
  }
})

// Use in prompt
$`Parse this data using ${schema}`
```

### Tables
```javascript
// CSV data
const rows = await parsers.CSV("data.csv")
defData("ROWS", rows, { 
  sliceHead: 100  // First 100 rows
})

// Excel data
const sheets = await parsers.XLSX("data.xlsx")
def("SHEET1", sheets[0])
```

### Code Files
```javascript
// Code with syntax highlighting
def("CODE", sourceCode, {
  language: "javascript",
  highlight: true
})
```

## Variable Extraction

### Pattern Matching
```javascript
// Extract variables from text
const { vars } = await extractVars(text, {
  patterns: {
    date: /\d{4}-\d{2}-\d{2}/,
    email: /[\w.-]+@[\w.-]+\.\w+/
  }
})
```

### Structured Data
```javascript
// Extract with schema
const data = await extractData(text, {
  schema: {
    name: "string",
    age: "number",
    email: "string"
  }
})
```

## Advanced Usage

### Conditional Variables
```javascript
def("GREETING", name ? `Hello ${name}` : "Hello there")
```

### Variable Chaining
```javascript
def("A", "Hello")
def("B", "{{A}} World")
def("C", "{{B}}!")
```

### Variable Scoping
```javascript
// Global scope
def("GLOBAL", "value")

// Local scope
script({
  vars: {
    local: "value"
  }
})
```

### Dynamic Variables
```javascript
// Function-based value
def("TIME", () => new Date().toISOString())

// Async value
def("DATA", async () => {
  const result = await fetchData()
  return result
})
```

## Security Considerations

### Secret Scanning
```javascript
// Scan variables for secrets
const scanner = await host.secretScanner()
await scanner.scan(vars.input)
```

### Content Safety
```javascript
// Check content safety
const safety = await host.contentSafety()
await safety.check(vars.content)
```

## Best Practices

1. **Variable Naming**
   - Use clear, descriptive names
   - Use UPPERCASE for global constants
   - Use camelCase for local variables

2. **Data Transformation**
   - Transform data before defining variables
   - Use schemas for validation
   - Handle edge cases

3. **Performance**
   - Cache large variable values
   - Use streaming for big files
   - Limit context size

4. **Security**
   - Scan for secrets
   - Validate user input
   - Apply content safety checks

5. **Error Handling**
   - Validate variable existence
   - Handle missing/null values
   - Provide fallback values

## Testing Variables

### Unit Tests
```javascript
test("variable test", async () => {
  def("TEST", "value")
  const result = await runPrompt()
  assert.includes(result.text, "value")
})
```

### Validation
```javascript
// Schema validation
const schema = defSchema("DATA", {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string" }
  }
})

// Validate data
const isValid = await validate(data, schema)
```

## Debugging Tips

1. **Inspect Variables**
```javascript
// Log variable value
console.log(env.get("VARNAME"))

// Debug mode
script({ debug: true })
```

2. **Trace Variable Usage**
```javascript
// Enable logging
script({
  logging: {
    variables: true
  }
})
```

3. **VS Code Integration**
- Use VS Code debugger
- Set breakpoints
- Inspect variable values
- Watch expressions

## Additional Resources

- [Variables Reference](https://microsoft.github.io/genaiscript/reference/scripts/variables/)
- [Schema Documentation](https://microsoft.github.io/genaiscript/reference/scripts/schemas/)
- [Parser Documentation](https://microsoft.github.io/genaiscript/reference/scripts/parsers/)
- [Best Practices](https://microsoft.github.io/genaiscript/getting-started/best-practices/)
