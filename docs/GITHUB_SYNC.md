# GitHub synchronization

The repository remote is configured as:

```text
https://github.com/02Franxx/nexus-personal-digital-platform.git
```

If `git ls-remote origin refs/heads/main` works but `git push` returns HTTP
`401`, the network is available and GitHub is requesting authentication. Sign
in to Git Credential Manager for the GitHub account that owns the private
repository, then retry:

```powershell
git push origin main
git ls-remote origin refs/heads/main
git status --short --branch
```

The final `ls-remote` check is the authoritative confirmation that GitHub has
the commit. Do not treat a local branch being ahead, or a completed push
process without a returned ref, as proof of synchronization.

Never put a personal access token, password, or `.env.local` value in this
repository or in a remote URL. Use Git Credential Manager or an SSH key.
