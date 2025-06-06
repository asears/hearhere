// the metadata
script({
    // user interface
    title: "Psychometrics MD: Psychometrics and Statistics",
    description: "Gathers information for psychometric analysis and personality assessment.",
    group: "documentation",
    // model configuration
    model: "large",
    temperature: 0,
})
def("FILES", env.files, {endsWith: ".md", ignoreEmpty: true});
$`Can you gather all the information to perform a full scale professional psychometric analysis, 
psychological profile, personality assessment of the author for FILE.`