# Geting Started
Here’s a concise summary of the commands you need to:

### 1. **Check `user.name` and `user.email` globally:**

* **Check `user.name`:**

  ```bash
  git config --global user.name
  ```

* **Check `user.email`:**

  ```bash
  git config --global user.email
  ```

### 2. **Remove `user.name` and `user.email` globally:**

* **Remove `user.name`:**

  ```bash
  git config --global --unset user.name
  ```

* **Remove `user.email`:**

  ```bash
  git config --global --unset user.email
  ```

These commands will clear the global Git configuration for `user.name` and `user.email`. Let me know if you need any further clarification!

To set `user.name` and `user.email` **locally** for a specific Git repository, use the following commands **from within the repository directory**:

### Clone the repository if not already exist
```bash
git clone <repository-url>
cd <repository-name>
gh auth login
```

---

### ✅ **Set local Git username and email:**

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

> ⚠️ These settings apply **only to the current repository**, not globally.

---

### 🔍 **Verify local configuration:**

```bash
git config user.name
git config user.email
```

Or to see all local Git configs:

```bash
git config --list --local
```

---

# Experiment 1: Setting Up and Basic Commands
Initialize a new Git repository in a directory. Create a new file and add it to the staging area
and commit the changes with an appropriate commit message.

```bash
# Step 1: Initialize the Git repository
git init  #do this inside your local git repository
# Step 2: Rename the default branch to 'main'
git branch -M main
# Step 3: Add all files to the staging area
git add .
# Step 4: Commit the changes with a message
git commit -m "React App without Backend Connected"
# Step 5: Log in to GitHub (only needs to be done once)
gh auth login
# Step 6: Create the GitHub repository, link to the local project, and push to GitHub
gh repo create LearningFrontEnd --public --source=. --remote=origin --confirm
# Step 7: Push to GitHub (use 'git push' after setting up remote tracking)
git push origin main
```

# Experiment 2: Creating and Managing Branches
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

# Experiment 3: Creating and Managing Branches
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

# Experiment 4: Collaboration and Remote Repositories
Clone a remote Git repository to your local machine.
When you **clone a Git repository**, Git fetches **all branches**, but **only checks out the default branch** (usually `main` or `master`). The other branches are available as **remote branches**, and you can check them out manually.

If you want to **see and work with all branches**, here’s how:

---

### ✅ 1. Clone the Repo (Normal Way)

```bash
git clone https://github.com/username/repo.git
cd repo
```

This fetches **all branches**, but only `main` is checked out.

---

### 🔍 2. View All Remote Branches

```bash
git branch -r
```

Example output:

```
origin/HEAD -> origin/main
origin/main
origin/dev
origin/feature/login
```

---

### ⬇️ 3. Checkout All Remote Branches (Optional Script)

If you want to **check out all remote branches locally**, you can run:

```bash
for branch in $(git branch -r | grep -v '\->'); do
    git branch --track "${branch#origin/}" "$branch" 2>/dev/null
done
```

Then fetch all:

```bash
git fetch --all
```

And verify:

```bash
git branch    # local branches
git branch -r # remote branches
```

---

### 🛠️ Notes

* You don’t need to clone the repo differently to get all branches — a regular `git clone` includes everything, just not all checked out locally.
* If you want to work on a branch like `dev`:

  ```bash
  git checkout dev
  ```

---


# Experiment 5: Collaboration and Remote Repositories
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


# Experiment 7: Git Tags and Releases
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

# Experiment 8: Advanced Git Operations
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

## **Summary of all commands**

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


# Experiment 12: Analysing and Changing Git History
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




# Additional Knowledge
## Section 3: Install Github CLI Steps (ubuntu 22.04)  
Update system (optional but recommended)
```bash
sudo apt update && sudo apt upgrade -y
Install GitHub CLI
sudo apt install gh
```
if this command fails
   - Add the GitHub CLI repository
```bash
curl -fsSL https://cli.github.com/packages/githubcli.repo | sudo tee /etc/apt/sources.list.d/github-cli.list
```

  - Import the GPG key
```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EB3CBB02
```

  - Update package list
  ```bash
  sudo apt update
  ```
  - Try Again 
    sudo apt install gh

- Verify installation (optional)
```bash
gh --version
```

### Section 4: Difference between Stashing Staging and Commit

### Git Workflow

1. **Work on files**  
   Your files are changed but unstaged.

2. **Stage changes**  
   Stage the changes you want to commit using `git add`.

3. **Commit staged changes**  
   Commit the staged changes to save your work with `git commit`.

4. **If interrupted with unfinished work**  
   Stash your changes using `git stash`, switch context, and then apply the stash later with `git stash apply`.

---

### Visual Analogy:

- **Unstaged changes** = Messy desk with all your current work.
- **Staging area (`git add`)** = Pile of papers you've selected to file.
- **Commit (`git commit`)** = Filing those papers into a permanent cabinet.
- **Stash (`git stash` and `git stash apply`)** = Putting your entire messy desk temporarily in a drawer to clear space, then pulling it back out later.

---

## Section 5: VS Code Live Server Setup

### Steps to Access Live Server on a LAN:

1. **Get your machine IP address**  
   Run the following command to find your machine's IP address:

```bash
ip addr show
```

(Note: You may need to install `inet` to get the proper output.)

Look for `inet:` to find the IP address.

2. **Optional: Allow firewall or port access**
   If you’re using the UFW firewall on Ubuntu, allow access to port 5500 (or the port that Live Server uses):

   ```bash
   sudo ufw allow 5500
   ```

3. **Access Live Server from other machines on the same LAN**
   Using the machine IP address found in step 1, access your server on another machine in the same network:

   ```
   http://192.168.1.42:5500/index.html
   ```

   Replace `192.168.1.42` with your actual IP address.


## Section 6: Delete an existig Branch
```bash
# 1. Check existing branches
git branch             # local branches
git branch -r          # remote branches

# 2. Delete local branch
git branch -d React-Experiment      # Safe delete (only if merged)
# OR force delete if unmerged
git branch -D React-Experiment

# 3. Delete remote branch
git push origin --delete React-Experiment

# 4. Clean up local references to deleted remote branches
git fetch -p

```