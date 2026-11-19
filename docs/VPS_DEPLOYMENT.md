# Gia Lai Eco Tourist VPS deployment and agent access

This runbook explains how we configured the frontend and VPS, how to publish a new build from the local repository, and how a local coding agent can access the server. It records the work from our deployment session and provides a repeatable update procedure with a backup and rollback.

Prepared on 30 October 2026. Historical observations below are not a live server audit.

## 1 Deployment inventory and recorded status

| Item | Value |
| --- | --- |
| Local frontend repository | `D:\Triad Intelli Studio\gialai_eco_tourist\frontend` |
| VPS public IPv4 address | `103.77.209.18` |
| VPS operating system | Ubuntu 24.04 |
| Confirmed SSH account | `root` using an authorized SSH key |
| Server document root | `/var/www/gialai-eco-tourist` |
| Nginx site configuration | `/etc/nginx/sites-available/default` |
| Main domain | `gialaiecotourist.com` |
| Additional hostname | `www.gialaiecotourist.com` |
| Authoritative DNS nameservers | `ns1.vinabits.net` through `ns4.vinabits.net` |
| Application | React 19, Vite 8, Tailwind CSS 4 |
| Local toolchain in `.mise.toml` | Node.js 22 and pnpm 10.34.3 |
| Production output | `dist/` |

The frontend was built locally, uploaded over SCP, and served by Nginx. We confirmed HTTP 200 responses for the HTML, JavaScript, and CSS after fixing the asset base path. We later confirmed that both domain names resolved only to the VPS address and returned HTTP 200.

The final successful Certbot result was not captured in our conversation. Check HTTPS and certificate renewal using section 7 before treating them as complete. The temporary deployment key used during the session was removed from the VPS and the PC afterward.

The provider panel displayed the username `thuevps1`, but `getent passwd thuevps1` on the VPS returned no account and key installation failed with `invalid user`. We then authorized a temporary key for the existing `root` account and successfully connected. Do not reuse `thuevps1` without confirming that someone has since created that Linux account.

## 2 How the deployment works

```text
Local repository on the Windows PC
        |
        | pnpm build with VITE_BASE_PATH=/
        v
dist directory containing HTML CSS JS and images
        |
        | SCP over SSH to the VPS public IP
        v
/var/www/gialai-eco-tourist
        |
        | Nginx serves static files on ports 80 and 443
        v
Browser using the domain name
```

The PC and VPS can be on different networks. SSH and SCP connect over the internet, normally on TCP port 22. Visitors connect to Nginx on ports 80 and 443. The PC does not need to stay online after the build has been uploaded.

The deployed frontend consists of static files. Nginx serves them without a Node.js process or Vite development server. Our deployment did not set up a separate application backend or copy a Git checkout onto the VPS.

Updating the local source or pushing a commit does not automatically change the files Nginx serves. Each VPS update requires a new build and upload unless a separate deployment workflow is added later.

## 3 Repository settings needed for the VPS

### Build scripts and deployment destinations

`package.json` defines `pnpm build` as `vite build`, with output in `dist/`. Use the Node.js and pnpm versions from `.mise.toml`, and install from the lockfile:

```powershell
Set-Location 'D:\Triad Intelli Studio\gialai_eco_tourist\frontend'
pnpm install --frozen-lockfile
```

For a fresh computer, obtain the repository first and use its frontend directory. Existing local edits are included in a build even if they have not been committed. Review `git status --short` before publishing and record the commit or working tree you intend to deploy.

The repository has two other deployment paths:

- `.github/workflows/deploy-pages.yml` deploys to GitHub Pages when `main` is pushed or the workflow is run manually.
- `make/deploy` builds and invokes `figma make deploy`.

Neither of these paths was configured by our work to publish to this VPS. They can remain separate from the manual VPS procedure.

### Asset base path

The current `vite.config.ts` chooses its base path from the shell environment in this order:

1. `VITE_BASE_PATH`, if set.
2. `FIGMA_PUBLIC_URL`, if set.
3. `/gialai_eco_tourist/` as the fallback.

The VPS serves the website at the hostname root. Therefore, explicitly set `VITE_BASE_PATH=/` in the build process. We used this override rather than changing the repository fallback, which can still be useful for a different hosting destination.

The original blank page happened because the HTML requested `/gialai_eco_tourist/assets/...` while the uploaded assets were at `/assets/...`. Nginx's React fallback returned HTML for those missing JavaScript and CSS URLs. A status of 200 alone did not prove that an asset was valid; its content type also mattered.

Set the base path in the PowerShell process that invokes the build. The Vite configuration reads it through `process.env`; setting it in that process is the verified procedure used here.

### Frontend environment configuration

Use `.env.example` as the checklist for the frontend configuration required by your environment. Fill the local configuration before building; do not copy real environment values into this runbook.

Vite's frontend environment values are compiled into the browser bundle. Only public client configuration belongs there. Server credentials and private SSH keys must stay outside the bundle and repository. Changing a compiled frontend setting requires rebuilding and redeploying.

## 4 Connect the local coding agent to the VPS

An SSH session already open in the user's terminal is not automatically available to the coding agent's command tool. The agent needs its own usable SSH authentication in the environment where its commands run. Workspace permissions also do not grant VPS login access.

### Use an existing authorized key

For routine updates, use an authorized key stored outside the repository. In local PowerShell, set its path and verify the remote account:

```powershell
$deployKey = Join-Path $env:USERPROFILE '.ssh\gialai-vps'
ssh.exe -i $deployKey -o IdentitiesOnly=yes root@103.77.209.18 'id'
if ($LASTEXITCODE -ne 0) { throw 'SSH authentication failed' }
```

The filename above is a suggested location, not a key we created and retained. Replace it with the path of your actual authorized private key. A passphrase protected key must be unlocked interactively or available through an SSH agent accessible to the coding agent's process. Do not paste its private contents or password into chat.

On the first connection from a new environment, compare the server fingerprint with one obtained from the VPS console before accepting it. For example, the console can display the Ed25519 host fingerprint:

```bash
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

### Create temporary access for a coding agent

This follows the method we used when no usable key was available. Generate a fresh key for a short deployment session; do not reuse the public key printed in the old conversation, because its private key was deleted.

Run in the agent's local PowerShell terminal:

```powershell
$deployKey = Join-Path $env:TEMP ('gialai-agent-' + [guid]::NewGuid().ToString('N'))
ssh-keygen.exe -t ed25519 -N '' -C 'gialai-agent-temporary' -f $deployKey
if ($LASTEXITCODE -ne 0) { throw 'Key generation failed' }
Get-Content -LiteralPath ($deployKey + '.pub')
```

This temporary key has no passphrase so the agent can use it during the session. Its private file stays on the local machine. Share only the generated `.pub` line with the VPS operator. Installing it for root grants the agent administrative access for the session.

In the existing VPS root console, install that newly generated public key. Replace the entire example line below with the actual `.pub` output before running it:

```bash
install -d -m 700 /root/.ssh
printf '%s\n' 'PASTE THE COMPLETE NEW ssh-ed25519 PUBLIC KEY LINE HERE' \
  >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

The replacement public key should end with the comment `gialai-agent-temporary`. The agent then verifies access using the SSH command in the preceding subsection, with `$deployKey` still set to the temporary private key path.

Keep the VPS console available until access and deployment are verified. If a shell process is restarted, restore `$deployKey` to the exact saved path; PowerShell variables do not carry into a new process automatically.

### Remove temporary access after the deployment

Run through the authenticated SSH connection, or directly in the VPS root console:

```bash
sed -i '/ gialai-agent-temporary$/d' /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
if grep -q ' gialai-agent-temporary$' /root/.ssh/authorized_keys; then
  echo 'Temporary key is still present'
else
  echo 'Temporary key removed'
fi
```

The dedicated comment identifies temporary keys created by this procedure. Once the server entry has been removed, delete the matching local temporary files in the same PowerShell session:

```powershell
Remove-Item -LiteralPath $deployKey, ($deployKey + '.pub')
```

Only run that deletion for the temporary key generated above. Keep a personal reusable key if that is your chosen access method.

## 5 Publish a repository update

The historical deployment used `scp -r dist ...:/tmp/` followed by a copy into the Nginx document root. The procedure below adds a unique staging directory, a backup, and publication of `index.html` after its assets to reduce the chance of serving a page that references files not yet copied.

### Step 1 Build on the Windows PC

Run from the repository directory in local PowerShell:

```powershell
Set-Location 'D:\Triad Intelli Studio\gialai_eco_tourist\frontend'
git status --short
git rev-parse --short HEAD
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed' }

$previousBasePath = $env:VITE_BASE_PATH
try {
    $env:VITE_BASE_PATH = '/'
    pnpm build
    if ($LASTEXITCODE -ne 0) { throw 'Production build failed' }
} finally {
    if ($null -eq $previousBasePath) {
        Remove-Item Env:VITE_BASE_PATH -ErrorAction SilentlyContinue
    } else {
        $env:VITE_BASE_PATH = $previousBasePath
    }
}

Select-String -Path .\dist\index.html -Pattern '/assets/'
```

Confirm that the generated JavaScript and CSS URLs begin with `/assets/`, rather than `/gialai_eco_tourist/assets/`. The successful build we previously ran reported a bundle size warning; that warning did not prevent publication.

### Step 2 Package and upload the build

Use the authorized private key path established in section 4. These commands assume `$deployKey` is already set in this PowerShell process:

```powershell
$releaseId = Get-Date -Format 'yyyyMMdd-HHmmss'
$archivePath = Join-Path $env:TEMP ("gialai-$releaseId.tar.gz")
tar.exe -czf $archivePath -C .\dist .
if ($LASTEXITCODE -ne 0) { throw 'Build packaging failed' }

scp.exe -i $deployKey -o IdentitiesOnly=yes $archivePath `
    "root@103.77.209.18:/tmp/gialai-$releaseId.tar.gz"
if ($LASTEXITCODE -ne 0) { throw 'Upload failed' }

Write-Output "Release ID: $releaseId"
ssh.exe -i $deployKey -o IdentitiesOnly=yes root@103.77.209.18
```

Copy the displayed release ID for the next step. The archive contains the contents of `dist/` at its top level, including `index.html` and `assets/`. Upload the built files rather than `node_modules`, private keys, or the local environment file.

### Step 3 Install the uploaded files on the VPS

The following block runs in Bash on the VPS as root. Replace `REPLACE_WITH_RELEASE_ID` with the value printed above. The backup and staging directories in this procedure are operational additions for future updates; they were not part of the original setup.

```bash
set -euo pipefail
release_id='REPLACE_WITH_RELEASE_ID'
webroot='/var/www/gialai-eco-tourist'
stage="/var/tmp/gialai-$release_id"
archive="/tmp/gialai-$release_id.tar.gz"
backup="/var/backups/gialai/site-$release_id.tar.gz"

test -f "$archive"
test ! -e "$stage"
install -d -m 755 "$stage" "$webroot"
install -d -m 700 /var/backups/gialai
tar -xzf "$archive" -C "$stage"
test -s "$stage/index.html"
test -d "$stage/assets"

# Back up the currently served files before copying anything.
tar -czf "$backup" -C "$webroot" .

# Copy assets and other top-level files before publishing the new HTML.
find "$stage" -mindepth 1 -maxdepth 1 ! -name index.html \
  -exec cp -a -t "$webroot" {} +
find "$webroot" -type d -exec chmod 755 {} +
find "$webroot" -type f -exec chmod 644 {} +
install -m 644 "$stage/index.html" "$webroot/.index.next.html"
mv -f "$webroot/.index.next.html" "$webroot/index.html"

nginx -t
systemctl reload nginx
printf 'Published release %s\nBackup %s\n' "$release_id" "$backup"
```

This update retains old hashed assets so browsers with an older HTML page can still load them. Review disk usage periodically and remove obsolete releases and archives according to your retention needs. Do not delete retained backups before verifying a new release.

Static file changes do not require a Vite or Node process restart. The Nginx reload above checks that the web server configuration is still valid and applies any associated configuration changes.

### Step 4 Verify the published website

From local PowerShell, request the page and inspect its asset references:

```powershell
curl.exe -sS --fail https://gialaiecotourist.com/
curl.exe -sSI https://www.gialaiecotourist.com/
```

Use `http://` while HTTPS is still being configured. Copy an actual JavaScript and CSS URL from the newly served HTML, then request their headers:

```powershell
curl.exe -sSI https://gialaiecotourist.com/assets/REPLACE_WITH_ACTUAL_JS_FILENAME.js
curl.exe -sSI https://gialaiecotourist.com/assets/REPLACE_WITH_ACTUAL_CSS_FILENAME.css
```

The page should return HTML, JavaScript should return a JavaScript content type, and CSS should return `text/css`. A missing asset returning `text/html` indicates that the SPA fallback is hiding a path error.

Open the site in a browser, refresh with Ctrl+F5, check the visible change, and open a known application route directly. If it remains blank, inspect the browser Console and Network panels for script failures or HTML responses to asset requests.

### Roll back an update

In the VPS root shell, select the exact backup archive printed by the failed deployment. This restores the saved HTML and assets while retaining any extra hashed files from the newer build:

```bash
set -euo pipefail
backup='/var/backups/gialai/site-REPLACE_WITH_RELEASE_ID.tar.gz'
test -s "$backup"
tar -xzf "$backup" -C /var/www/gialai-eco-tourist
nginx -t
systemctl reload nginx
```

Verify the browser and asset responses again. These backups contain frontend files, not Nginx configuration or certificates. Back up the site configuration separately before changing it.

## 6 VPS and Nginx configuration

We installed Nginx through Ubuntu's package manager and enabled its systemd service:

```bash
apt update
apt install -y nginx
systemctl enable --now nginx
```

The following is an initial HTTP configuration for `/etc/nginx/sites-available/default`. Use it for first setup or as a reference. If Certbot has already added TLS settings to the live configuration, preserve those settings rather than replacing the file with this HTTP-only example.

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name gialaiecotourist.com www.gialaiecotourist.com;

    root /var/www/gialai-eco-tourist;
    index index.html;

    location /assets/ {
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

The SPA fallback supports direct navigation to React routes. The explicit assets location is a suggested improvement: it returns a real 404 for missing assets instead of the HTML shell. The configuration we inspected during the original deployment had the document root and SPA fallback, with `server_name _;` as a catch-all; confirm the final hostname and TLS configuration on the server when editing it.

Before editing an existing configuration, make a dated copy:

```bash
cp -a /etc/nginx/sites-available/default \
  "/etc/nginx/sites-available/default.backup-$(date +%Y%m%d-%H%M%S)"
nginx -t
systemctl reload nginx
```

Run the last two commands again after your edit. Reload only after the syntax check succeeds. Useful read-only diagnostics include:

```bash
systemctl status nginx --no-pager
ss -lntp
tail -n 50 /var/log/nginx/error.log
```

Allow TCP 22 for SSH, 80 for HTTP and certificate validation, and 443 for HTTPS in the provider firewall. If UFW is active, allow SSH and Nginx there too:

```bash
ufw status
ufw allow OpenSSH
ufw allow 'Nginx Full'
```

The provider firewall and UFW are separate controls. Check both if a connection times out. Keep SSH allowed before enabling a previously inactive firewall.

## 7 Domain DNS and HTTPS

The intended website records are:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `103.77.209.18` |
| A | `www` | `103.77.209.18` |

During troubleshooting, a second page of the DNS panel contained duplicate records: `@` pointed to `15.235.211.246` and `www` pointed to `103.110.87.179`. Adding the new records had left the old ones active. Certificate validation sometimes reached those other servers and failed with a timeout or 404.

After those two obsolete records were removed, our queries to VinaBits nameservers and Cloudflare's resolver returned only `103.77.209.18` for both names. HTTP requests to both also returned 200 from the VPS.

Records for `en`, `fr`, or `*` are separate subdomain decisions. They do not override explicit A records for the apex and `www`. Mail MX, SPF TXT, DKIM CNAME, verification TXT, and autodiscover records support email and should be preserved when updating website records.

Check authoritative and public answers before requesting a certificate:

```bash
nslookup gialaiecotourist.com ns1.vinabits.net
nslookup www.gialaiecotourist.com ns1.vinabits.net
nslookup gialaiecotourist.com 1.1.1.1
nslookup www.gialaiecotourist.com 1.1.1.1
```

Both names should resolve only to the intended VPS IPv4 address for this setup. Also inspect AAAA records if IPv6 is in use; they must reach a server serving the same domain and challenge. The DNS panel used TTL 3600 for the new records, so cached results could outlive a control panel edit.

Certbot was installed and executed during the session, but its final successful issuance was not recorded. On that existing VPS, first inspect the installed certificates:

```bash
certbot certificates
```

Once DNS and HTTP are correct, obtain or install the certificate if needed:

```bash
certbot --nginx -d gialaiecotourist.com -d www.gialaiecotourist.com
```

Allow Certbot to configure Nginx and choose the HTTP-to-HTTPS redirect if offered. Then check both HTTPS hostnames from the PC using `curl.exe -I` without disabling certificate verification. On the VPS, check renewal:

```bash
certbot renew --dry-run
systemctl list-timers --all | grep -i certbot
```

Inspect the renewal mechanism appropriate to the actual Certbot installation, such as its snap timer, systemd timer, or cron entry. Certificate renewal must continue after the deployment session ends.

For a replacement server, follow the current Ubuntu and Nginx instructions at <https://certbot.eff.org/instructions>. The installation method previously discussed was Certbot through snap. Avoid mixing package-manager and snap installations without checking the existing installation first.

## 8 Troubleshooting from our deployment

| Symptom | What to check or do |
| --- | --- |
| `Permission denied (publickey,password)` | Confirm the real Linux account exists, the chosen private key matches an authorized public key, and the key is unlocked or usable by the agent process. |
| `install: invalid user 'thuevps1'` | That account did not exist in our VPS session. Use the confirmed existing account; root key access was the method that worked. |
| The PC can SSH but the coding agent cannot | The agent may have a different process, SSH configuration, key path, or agent socket. Test authentication from the coding agent's own terminal. |
| Blank white page with HTTP 200 | Check HTML asset paths and asset content types. Build with `VITE_BASE_PATH=/` for the VPS root. |
| The Nginx welcome page appears | Check the active document root and deployed `index.html`; `nginx -t` validates syntax rather than application content. |
| IP works but domain behaves inconsistently | Query all A and AAAA answers. Duplicate A records routed requests to other servers in our case. |
| Certbot reaches an old address | Remove the obsolete DNS records and verify authoritative DNS and public resolution before retrying. |
| Certbot times out at the correct VPS address | Check Nginx, incoming TCP 80, provider firewall, UFW, and any proxy in front of the server. |
| Source changed but live site did not | Build the intended working tree, upload the new output, publish it into the actual document root, and refresh the browser. |

## 9 Completion record for each update

Record the release ID, source commit and any deliberate local edits, build result, deployed hostname, backup path, and verification result. Confirm temporary agent access has been removed if it was used.

Keep this document with the repository so future coding sessions can find the actual SSH account, document root, build base setting, and DNS history. No passwords, private keys, certificate private material, or real environment secrets belong in the deployment record.

## References

- Project configuration: `package.json`, `.mise.toml`, `vite.config.ts`, `.env.example`, `.gitignore`, `.github/workflows/deploy-pages.yml`, and `make/deploy` inspected on 30 October 2026.
- Deployment evidence: the terminal results and DNS panel screenshots from our earlier conversation. Later server changes may supersede those observations.
- Vite deployment documentation: <https://vite.dev/guide/static-deploy.html>.
- Vite environment variables: <https://vite.dev/guide/env-and-mode.html>.
- Certbot installation instructions: <https://certbot.eff.org/instructions>.
