defAgent(
    "git", // agent id becomes 'agent_git'
    "Handles any git operation", // description
    "You are a helpful expert in using git.",
    {
        tools: ["git_list_commits"],
    }
)
script({
    tools: "git_list_commits",
})
// agent git to get the commits
$`Do a statistical analysis of the last commits.  number of commits, frequency by author, date range, sentiment of message.`