// the metadata
script({
    // user interface
    title: "Diagram Sentences",
    description: "Diagrams sentences.",
    group: "documentation",
    // model configuration
    model: "large",
    temperature: 0,
})
def("FILES", env.files, {endsWith: ".md", ignoreEmpty: true});
$`Generate diagrams of each sentence in the text.
Use the text in FILE as input.
For each sentence, include a markup diagram that shows the subject, verb, and object.
Ensure that the diagrams are clear and easy to understand.
Ensure that the diagrams are formatted in a way that is easy to read and understand.
Ensure that the diagrams are accurate and reflect the structure of the sentences.
If a sentence is complex, break it down into simpler sentences and diagram each one.
If a sentence contains multiple clauses, diagram each clause separately.
Include sentiment score and analysis for each sentence as markup in smaller text above the diagram.
Ensure that the sentiment analysis is accurate and reflects the tone of the sentence.
`