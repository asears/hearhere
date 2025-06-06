defAgent(
    "git", // agent id becomes 'agent_git'
    "Handles any git operation", // description
    "You are a helpful expert in using git.",
    {
        tools: ["github_pulls_list", "github_pulls_get", "github_pulls_review_comment_list"],
    }
)
script({
    tools: "git_list_commits",
})

// agent git to get the commits
$`Do a statistical analysis of the last 10 pull requests.  numer of files, age of request, sentiment of description and comments.`