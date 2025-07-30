## Experiment 2: Creating and Managing Branches
Create a new branch named "feature-branch." Switch to the "master" branch. Merge the
"feature-branch" into "master.


---

### Scenario:

Suppose your latest commit history looks like this:

```
5962ac5 (HEAD -> main, origin/main) Java Script Added for Click Behaviour for Menu links
15e487b styling added to HTML elements
5eefb41 page elements html Ready
```

---

### Goal:

* Create a new branch called `feature-branch`
* Switch back to the `main` branch
* Merge `feature-branch` into `main`

---

### Step-by-step commands with explanations:

1. **Create a new branch named `feature-branch`**

```bash
git branch feature-branch
```

This creates a new branch called `feature-branch` from the current commit on `main`.

---

2. **Switch to the new branch `feature-branch`**

```bash
git checkout feature-branch
```

Now you’re on the `feature-branch` and can make changes or commits here separately.

---

3. **(Optional) Make changes and commit them on `feature-branch`**

For example:

```bash
# edit some files
git add .
git commit -m "Added new feature"
```

---

4. **Switch back to the `main` branch**

```bash
git checkout main
```

---

5. **Merge the changes from `feature-branch` into `main`**

```bash
git merge feature-branch
```

If there are no conflicts, the merge will complete automatically.

Delete the `feature-branch`:

```bash
git branch -D feature-branch
```

---

6. **(Optional) Push your updated main branch to remote**

```bash
git push origin main
```

---

### Summary of commands for your use case:

```bash
git branch feature-branch
git checkout feature-branch
# Make changes and commit if needed
git checkout main
git merge feature-branch
git branch -D feature-branch
git push origin main  # if you want to update remote repo
```

## Experiment 3: Creating and Managing Branches
Write the commands to stash your changes, switch branches, and then apply the stashed
changes.

---

### 1. Stash your current changes

```bash
git stash
```

### 2. Create a new branch and switch to it

For example, create a branch called `new-feature`:

```bash
git checkout -b new-feature
```

### 3. Apply the stashed changes onto the new branch

```bash
git stash pop
```

---

### 4. Switch back to `main` branch

```bash
git checkout main
```

### 5. Delete the new branch (`new-feature`) locally

```bash
git branch -d new-feature
```

### 6. Clean the stash area

* If you want to **clear all stash entries** (be careful, this deletes all stashed work):

```bash
git stash clear
```

* Or if you want to **drop the most recent stash** (if you didn’t use `pop` but `apply` before, or there are multiple stashes):

```bash
git stash drop
```

---

### Summary of commands:

```bash
git stash
git checkout -b new-feature
git stash pop
git checkout main
git branch -d new-feature
git stash clear
```

---


## Experiment 5: Collaboration and Remote Repositories
Fetch the latest changes from a remote repository and rebase your local branch onto the
updated remote branch.
### Scenario

* You have a local Git repository.
* Your current branch is `feature`.
* There is a remote repository (let’s call it `origin`).
* The remote branch is also called `feature`.
* Other developers have pushed new commits to `origin/feature`.
* You want to update your local `feature` branch to include those changes *but* keep your own commits on top of the updated remote branch.

---

### What does this mean?

* **Fetching** gets the latest changes from the remote repository and updates your local view of the remote branches (`origin/feature`).
* **Rebasing** means you take your local commits on `feature` branch and replay them on top of the latest `origin/feature` commits.

---

### Step-by-step breakdown

1. **You run:**

   ```bash
   git fetch origin
   ```

   * This downloads the latest commits from the remote repository, updating your `origin/feature` pointer.
   * Your local branch `feature` does not change yet; only the remote-tracking branch `origin/feature` is updated.

2. **Then you run:**

   ```bash
   git rebase origin/feature
   ```

   * Git will take your local commits on `feature` that are not in `origin/feature` and replay them on top of `origin/feature`.
   * This makes your branch linear and up to date with the remote branch.

---

### Example timeline

* Remote branch `origin/feature`:

  ```
  A -- B -- C
  ```

* Your local branch `feature` was at commit `B` and you made two commits locally:

  ```
  A -- B -- X -- Y (your local `feature`)
  ```

* Meanwhile, someone else pushed commit `C` to remote, so now:

  ```
  A -- B -- C (origin/feature)
  ```

* You fetch, which updates your remote tracking branch:

  ```
  origin/feature -> C
  ```

* Your local `feature` is still at `Y`.

* You rebase:

  * Git will replay your commits `X` and `Y` on top of `C`.
  * After rebase, your `feature` branch looks like:

  ```
  A -- B -- C -- X' -- Y' (your local `feature`)
  ```

  (Note: X' and Y' are new commits because rebase rewrites commit history.)

---

### Why do this?

* Keeps your history clean and linear.
* Makes it easier to merge later without conflicts.
* Avoids the "merge commits" that happen if you just do a normal `git pull` (which does fetch + merge by default).

---

### Summary

| Command      | What it does                                  |
| ------------ | --------------------------------------------- |
| `git fetch`  | Updates remote branches locally               |
| `git rebase` | Applies your commits on top of remote updates |

---


## Experiment 7: Git Tags and Releases
Write the command to create a lightweight Git tag named "v1.0" for a commit in your local
repository.

---

### 1. Create lightweight tags `Version1` and `Version2`

You create lightweight tags by specifying the tag name only (no `-a` or `-m`):

```bash
git tag Version1
git tag Version2
```

By default, these tags will point to the current commit (HEAD).
If you want to tag a specific commit, add the commit hash after the tag name, for example:

```bash
git tag Version1 15e487b
git tag Version2 5eefb41
```

---

### 2. List all tags

```bash
git tag
```

This will show all tags in your local repo, like:

```
Version1
Version2
```

---

### 3. Delete tags locally

To delete the tags from your local repository (without deleting commits):

```bash
git tag -d Version1
git tag -d Version2
```

---

### Summary commands for your case

```bash
# Create tags for specific commits
git tag Version1 15e487b
git tag Version2 5eefb41

# List tags
git tag

# Delete tags locally
git tag -d Version1
git tag -d Version2
```

---

## Experiment 8: Advanced Git Operations
Write the command to cherry-pick a range of commits from "source-branch" to the current
branch.
Sure! Here's the step-by-step answer tailored for your exact scenario, considering the issues you ran into with cherry-picking onto an orphan branch:

---

## Scenario Recap

Your commit history on `main`:

```
3b623f6 (HEAD -> main, origin/main) Java Script Added for Click Behaviour for Menu links
15e487b styling added to HTML elements
5eefb41 page elements html Ready
```

---

## 1. Create a new branch **without any history** (an orphan branch) and switch to it

```bash
git checkout --orphan new-branch
```

This creates a new branch with no commits.

Clear out files from the index:

```bash
git rm -rf .
```

---

## 2. Create an initial empty commit (to avoid cherry-pick conflicts) and cherry-pick the commits from `main`

Since the new branch has no commits, cherry-picking directly will cause conflicts.

So first create an empty commit:

```bash
git commit --allow-empty -m "Initial empty commit on new-branch"
```

Now cherry-pick the commits from oldest to newest (to preserve order):

```bash
git cherry-pick 5eefb41
git cherry-pick 15e487b
git cherry-pick 3b623f6
```

If conflicts arise during any cherry-pick, resolve them by editing files, then:

```bash
git add <files>
git cherry-pick --continue
```

---

## 3. Verify cherry-pick

Check the commit history in your new branch:

```bash
git log --oneline
```

You should see:

```
3b623f6 Java Script Added for Click Behaviour for Menu links
15e487b styling added to HTML elements
5eefb41 page elements html Ready
Initial empty commit on new-branch
```

(Note: commits appear in reverse chronological order.)

---

## 4. Delete the new branch

Switch back to `main`:

```bash
git checkout main
```

Delete the `new-branch`:

```bash
git branch -D new-branch
```

---

# **Summary of all commands**

```bash
git checkout --orphan new-branch
git rm -rf .
git commit --allow-empty -m "Initial empty commit on new-branch"
git cherry-pick 5eefb41
git cherry-pick 15e487b
git cherry-pick 3b623f6
# (resolve conflicts if any, then git add + git cherry-pick --continue)
git checkout --theirs -- <file with Conflict>
git add .
git cherry-pick --continue
git log --oneline
# Delete the new-branch just to keep everything clean
git checkout main
git branch -D new-branch
```


## Experiment 12: Analysing and Changing Git History
Write the command to undo the changes introduced by the commit with the ID "abc123".

---

### ✅ Step 1: Create the "Expermenting" Commit

Make any changes you want to experiment with, then stage and commit them:

```bash
git add .
git commit -m "Expermenting"
```

Assume this gives you a new commit like:

```
a1b2c3d Expermenting
```

---

### ✅ Step 2: Undo the Changes Introduced by "Expermenting" (Using `git reset`)

You want to **undo the changes introduced by the "Expermenting" commit**, meaning you want to **remove the commit but keep the changes in your working directory** (so you can re-edit or fix them).

To do that, use:

```bash
git reset HEAD~1
```

This command:

* Removes the latest commit (i.e., "Expermenting")
* Keeps the changes introduced by that commit in your working directory (so they're not lost)

---

### 🔄 Alternatively: If You Want to Remove the Commit and Discard the Changes

Use:

```bash
git reset --hard HEAD~1
```

⚠️ This **discards all changes** from the "Expermenting" commit — use only if you're sure.

### ✅ **Summary**

```bash
# 1. Create a new commit named "Expermenting"
git add .
git commit -m "Expermenting"

# 2. Undo the last commit but keep changes (soft reset)
git reset HEAD~1

# 3. Undo the last commit and discard changes (hard reset)
git reset --hard HEAD~1

# 4. View commit history in one line per commit
git log --oneline

# 5. Revert a specific commit by ID (creates a new commit that undoes it)
git revert <commit-id>

# 6. Discard all uncommitted changes (restore working directory)
git restore .         # For unstaged changes
git reset --hard      # For both staged and unstaged changes

# 7. Check current branch and status
git status
```

---



