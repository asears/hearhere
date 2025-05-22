# Using Marp for Presentations

## Setup Instructions

1. Install Node.js if not already installed
2. Install Marp CLI globally:
```bash
npm install -g @marp-team/marp-cli
```

3. Install VSCode Marp extension:
   - Open VSCode
   - Press Ctrl+P
   - Type: `ext install marp-team.marp-vscode`

## Converting Presentations

### To PDF
```bash
marp --pdf presentation.md
```

### To PowerPoint (PPTX)
```bash
marp --pptx presentation.md
```

### Batch Convert All
```bash
marp --pdf --pptx *.md
```

## Marp Markdown Syntax

### Basic Structure
```markdown
---
marp: true
theme: default
paginate: true
---

# Title Slide

---

## Second Slide
Content goes here
```

### Themes
Available themes:
- default
- gaia
- uncover

To change theme:
```markdown
---
theme: gaia
---
```

### Styling
- Background images: `![bg](image.jpg)`
- Background color: `![bg](#123456)`
- Split backgrounds: `![bg left](image.jpg)`

### Code Blocks
````markdown
```python
def hello():
    print("Hello World!")
```
````

## Directory Structure
- `*.md` - Source Markdown files
- `/pdf` - Generated PDF files
- `/pptx` - Generated PowerPoint files

## Best Practices
1. Use clear section headings
2. Include agenda slides
3. Keep content concise
4. Use images effectively
5. Include code samples where relevant

## Common Issues
- If images don't render, ensure paths are relative to markdown file
- For custom fonts, include them in your CSS theme
- For large presentations, split into multiple files
