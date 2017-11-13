# The Comments Problem 💬

Github has [neat statistics](https://github.com/facebook/react/graphs/contributors) for contributors, it shows number of commits and nice charts. But people contribute to Github projects not only via commits, actually a lot of contributions happens in issue or pull request comments 💬. Github doesn't have statistics to show "top commenters", we think those people also deserve recognition.

## Task
Fortunately Github has a [great HTTP API](https://developer.github.com/v3/repos/comments/) to help with that. There are 3 types of comments a person can make, comment on individual comment, comment in an Issue/Pull Request or comment in a Pull Request review. You can read more in [their docs](https://developer.github.com/v3/guides/working-with-comments/), if you are curious, but it's not required for this task.

Mentioned 3 types of comments can be accessed using the following API endpoints:

- [Get Commit Comments](https://developer.github.com/v3/repos/comments/#list-commit-comments-for-a-repository)
- [Get Issues Comments](https://developer.github.com/v3/issues/comments/#list-comments-in-a-repository)
- [Get Pull Requests Comments](https://developer.github.com/v3/pulls/comments/#list-comments-in-a-repository)

We would need to fetch all existing comments for a given repository for a given period, group by user and output it sorted by number of comments:

```bash
node index.js --repo anton/test-project --period 20d

3012 comments, Michael Davidovich (20 commits)
1345 comments, Sergey Repkov (2104 commits)
1024 commits, Anton Vynogradenko (234 commits)  

```

- [Get Statistics Per Collaborator](https://developer.github.com/v3/repos/statistics/#get-contributors-list-with-additions-deletions-and-commit-counts)


## Requirements
Just like with about any API respect [their rate limits.](https://developer.github.com/v3/rate_limit/)

[Create personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and save it in a secure location.


## Setup

We provide a basic project setup, so you don't have to worry about setting up our environment. You would need to obtain and use your access key.

To get started:

- fork this repository

## Main Challenge
## Bonus Challenge
