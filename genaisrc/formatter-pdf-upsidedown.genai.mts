// the metadata
script({
    // user interface
    title: "Formatter PDF: Upside-down pyramid style",
    description: "Formats the PDF text as an upside down pyramid, useful for emails.",
    group: "documentation",
    // model configuration
    model: "large",
    temperature: 0,
})
def("DOCS", env.files) // Contains pdf files
def("DOCS", env.files, {endsWith: ".pdf", ignoreEmpty: true});
$`The inverted pyramid style is a writing style that presents the most important information first, followed by supporting details. It is commonly used in journalism and technical writing to ensure that readers quickly grasp the main points.
Format the documents in FILE and summarize it.  Present the most important information at the beginning, followed by supporting details.
Ensure that the text is clear, concise, and easy to read.
Ensure that the lines flow larger to smaller, with the most important information at the top and the least important at the bottom.
Replace bullet points with paragraphs, headings with sentences, and expand information in bullet points, if necessary, to ensure clarity and readability.
`