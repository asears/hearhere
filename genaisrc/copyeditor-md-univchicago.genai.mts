// the metadata
script({
    // user interface
    title: "Copy Editor MD: University of Chicago Dissertation Style",
    description: "Copy edits the text as a tech editor, University of Chicago Dissertation Style.",
    group: "documentation",
    // model configuration
    model: "large",
    temperature: 0,
})
def("FILES", env.files, {endsWith: ".md", ignoreEmpty: true});
$`You are an expert technical writer and proofreader and an editor who designed the Chicago Style Guide.
Review the documents in FILE and fix the top 10 most important issues according to the University of Chicago Dissertation Style.
Ensure that the text is well-structured and follows the University of Chicago Dissertation Style guidelines.`