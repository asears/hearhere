// the metadata
script({
    // user interface
    title: "Technical proofreading",
    description: "Reviews the text as a tech writer, University of Chicago Dissertation Style.",
    group: "documentation",
    // model configuration
    model: "large",
    temperature: 0,
})
def("FILES", env.files, {endsWith: ".md", ignoreEmpty: true});
$`You are an expert technical writer and proofreader.
Review the documents in FILE and report the top 10 most important issues according to the University of Chicago Dissertation Style.
Report issues with this FILE using output and annotations.`