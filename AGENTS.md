# Anima Development Notes

## Local Setup

- Repo path: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima`
- Site URL: `http://style-manager.local`
- GitHub: `https://github.com/pixelgrade/anima`
- Theme type: block theme (FSE), integrated with Style Manager and Nova Blocks

## Build Prerequisites

- Node: **22+** (required by repo config)
- Build commands must run from theme root

Switch Node first:

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
```

## Critical Build Warnings

- `npm run build` is full release build, not just local compile.
- Build flow can delete and recreate `../build/` during packaging.
- `style.css` is compiled output. Do not edit compiled CSS directly.
- Use placeholder text domain `__theme_txtd` in source; build replaces it with `anima`.

## Build Commands

### Production build + zip

```bash
npm run build
```

This runs:
- webpack production JS build
- gulp styles compile
- gulp zip pipeline (`build:translate`, `build:folder`, `build:fix`, `build:zip`)

Zip output is one directory above theme root (for example `../Anima-X-Y-Z.zip`).

### Development watch

```bash
npm run dev
```

## Release Verification

```bash
ls -la ../Anima-*.zip
unzip -p ../Anima-X-Y-Z.zip anima/style.css | head -15
unzip -l ../Anima-X-Y-Z.zip | grep -E "CLAUDE.md|/src/|node_modules|webpack"
```

Expected:
- zip exists and version header is correct
- development-only files are not packaged

## Version Update Checklist

When releasing:

- update version in `src/scss/style.scss` theme header
- rebuild so `style.css` and `style-rtl.css` reflect the new version
- include generated assets and translation updates in commit

## GitHub Release Flow

```bash
git add <files>
git commit -m "message"
git push origin main

git tag -f X.Y.Z
git push origin X.Y.Z --force

gh release create X.Y.Z ../Anima-X-Y-Z.zip --title "X.Y.Z" --notes "Release notes"
```

## Issue and Commit Workflow

For each fix or feature:

1. Create or link a GitHub issue.
2. Assign issue to the active milestone.
3. Reference issue in commit message (`Refs #N` or `Fixes #N`).
4. Push and verify issue/milestone status.

Apply this consistently across `anima`, `style-manager`, and `nova-blocks` when work spans repos.
