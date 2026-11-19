# Release flow (simple)

| Branch | Goes to | When |
|---|---|---|
| `main` | GitHub Pages (dev/test) | Every push to `main` |
| `release` | VPS (production) | Every push to `release` |

## Test a change
```powershell
git push origin HEAD:main
```
Check the Pages site on your phone.

## Release to production
When `main` looks good on Pages:
```powershell
git push origin main:release
```
Watch it run in the GitHub **Actions** tab ("Deploy to VPS").

## Roll back
Push the previous good commit to `release`:
```powershell
git push --force origin <good-commit-sha>:release
```
