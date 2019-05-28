# Prior Art Archive contribution guidelines

This is a guide to improving the Prior Art Archive codebase.  
For an intro to the project, see [the README](README.md). 
Project discussions fall under our [code of conduct](docs/CODE_OF_CONDUCT.md).

## Submitting and Reviewing Code

This repository has a home on [GitHub](https://github.com/prior-art-archive/priorartarchive.org),
where you can submit [pull requests](https://help.github.com/articles/about-pull-requests/) (PRs).

Please submit changes via pull request, even if you have direct commit access.  
This lets us review change proposals, and ensures your changed code builds cleanly via automated builds.

As you work on your branch, test locally to ensure it still builds and deploys properly, and that you haven't introduced new bugs. 
For test guidelines, see [testing](docs/TESTING.md).

The more controversial, complex or large a change, the more opportunity people should have to comment on it.  
You can discuss a change before or while you work on it; we don't have hard rules about such things.

Merging is a judgment call.  Usually once an "approved" review goes through, and there are no more changes requested, 
the author of the PR will merge it (if they have access).  
If you're unsure, ask!  "Is this ready to merge?" is often a useful next step in the conversation.

If you fix a bug or add a feature, please write a [test](docs/TESTING.md) to go with the change 
If the change involves libraries or would be difficult to test, please use a Given-When-Then description 
or describe in your PR message how reviewers should test that it works as expected.

### Document as you go

If you introduce a new framework or dependency, add information to [INSTALL.md](INSTALL.md) and other docs.

### Configurations

Never hard code values that should be configurable.
Commits that introduce a new configurable variable should document the configuration steps in the commit message.

### Migrations

The golden rule of migrations: Never edit a migration file that has been committed to master.


### Linting and Code Style


### The "Obvious Fix" rule: committing some minor changes directly to master

Certain presumed-safe changes may be reviewed post-commit instead of pre-commit, 
meaning that they can be committed directly to `master` without going through a PR, to save time.

In practice, that means the following kinds of changes:
* Clear typo fixes.
  However, if a typo affects code behavior, other than in displayed text, it should go through a PR review.

* Whitespace and formatting cleanups.

* Developer documentation changes.
  However, substantive changes to documentation should still go through the normal PR process.

It's always okay to use a PR for an "obvious fix". If there is a chance of controversy, err on the side of PR.

### Branching and Branch Names

We do development on lightweight branches, with each branch encapsulating one logical changeset (one group of related commits).  
Please try to keep changesets small and well-bounded: a branch should usually be short-lived, 
and turned into a PR + reviewed + merged to `master` as soon as possible.  
This reduces the likelihood of merge conflicts.

When a branch is associated with an issue, start the branch name with the issue #  and give a very brief summary, 
with hyphens as the separator, e.g.:

    871-fix-zip-ingestion-process

Sometimes a branch may address only part of an issue. Different branches can start with the same issue number, 
as long as the summary indicates what part of the issue is addressed.

If there is no issue number associated with a branch, don't start the branch name with a number.

While there are no strict rules on how to summarize a branch's purpose keep in mind some common starting words:
"`fix`", "`feature`", "`refactor`", "`remove`", "`improve`", and "`test`".

### Rebases and force-pushes

...

### Commit messages

#### Style guide

Please adhere to [these guidelines](https://chris.beams.io/posts/git-commit/) for each commit message:  

1. Separate subject from body with a blank line
2. Limit the subject to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain _what_ and _why_, vs. _how_

It's ok to sometimes ignore / miss some of these guidelines.
Contributions will be asked for revision if they violate 1, 2 or 7

Think of the commit message as an introduction to the change.
A reviewer will read the commit message right before reading the diff, 
so this should put the reader in the right frame of mind to understand that.

The reason for the short initial summary line is to support commands, such as `git show-branch`,
which list changes by showing just the first line of each commit message.


#### Reference Issues

If a commit is related to one or more issues, include both the issue # (as shown in the GitHub UI and URL) 
and the title of each issue near the end of the commit message (but before co-authors). Ex:

```
Issue #12 This is the title of a very long issue which needs to be
          wrapped to avoid going over 72 characters
Issue #34 Another, shorter, issue title
```

Including the issue number (with the `#` prefix) allows the GitHub UI to 
[automatically link the commit to the issue](https://help.github.com/articles/autolinked-references-and-urls/#issues-and-pull-requests),
and including the issue title makes it easier to understand without needing to visit the issue tracker.

#### Credit Co-authors

If you paired with someone, or are incorporating their work, give them due credit
with a `Co-authored-by` line(s) at the end of the commit message. For details, read 
[Creating a commit with multiple authors](https://help.github.com/articles/creating-a-commit-with-multiple-authors/).

### Indentation and Whitespace

Please uses spaces, never tabs, and avoid trailing whitespaces.  
The file [.editorconfig](.editorconfig), in the repository's root directory, 
may encode these formatting conventions in a way that most text editors can read.

If committed code does not conform to these standards, when you find yourself about to make changes to such code, 
please first make a whitespace-only commit to regularize the indentation, and then a separate commit with your code changes.

### Licensing Your Contribution
This project is published as free software using the GPL v2 license, but may be relicensed under an MIT license.

If you submit code that you wrote or that you have authority to submit from your employer or institution, 
please give it to us under an MIT or more permissive license (BSD, ISC, [https://blogs.harvard.edu/sj/utter/](∅)).
Please make the license of the code clear in your pull request.  Tell us who wrote it, if that isn't just you.  
If the code was written for an employer, tell us that too.  Tell us what license applies to the code, especially 
if it differs from the recommendation above. 

If you submit code that doesn't come from you or your employer, that is "Third-Party Code". 
If the code contains a license statement, that's great.  If not, please tell us the license that applies to the code 
and provide links to whatever resources you used to find that out. For some examples, see the LICENSE and METADATA 
parts of [Google's guide to introducing third-party code](https://opensource.google.com/docs/thirdparty documentation/#license).

If your submission doesn't include Third Party Code, but instead depends on it in some other way, 
we might need a copy of that software.  Your submission should tell us where and how to get it as well as the license that applies
to that code.  We will archive a copy of that code if we accept your pull request.

### Expunge Branches Once They Are Merged

Once a branch has been merged to `master`, please delete the branch. 
You can do this via GitHub PR management (it offers a button to delete the branch, once the PR has been merged), 
or via the command line:

    # Make sure you're not on the branch you want to delete.
    $ git branch | grep '^\* '
    * master

    # No output from this == up-to-date, nothing to fetch.
    $ git fetch --dry-run

    # Delete the branch locally, if necessary.
    $ git branch -d some-now-fully-merged-branch

    # Delete it upstream.
    $ git push origin --delete some-now-fully-merged-branch

## Avoiding Generatable Elements In The Repo

We try to keep generated elements out of the repository, including files that result from build processes.  
If we want to memorialize a compiled version of the program, the best way to do that is with tags, 
or by recording that information & putting the saved version somewhere else.  
If a file can be generated from the materials in the repository using commonly-available tools, 
please do not put it in the repository without raising it for discussion.

## Thank you!

The Knowledge Futures Group, the Archive, and Bad Idea Factory appreciate your dedication and service to the public good.

## Attribution

This Contributing document is adapted 
from this [Tech and Check](https://github.com/TechAndCheck/tech-and-check-alerts/blob/master/CONTRIBUTING.md) document, 
from work by [Open Tech Strategies](opentechstrategies.com).
