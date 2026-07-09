---
name: Release
about: Track a Pixelgrade theme or plugin release
title: "Release <product> <version>"
labels: "[Type] Maintenance"
assignees: ""
---

## Manifest

- Product:
- Version:
- Repo:
- Branch:
- Channels:
- Related issues:
- Previous public version:
- Release owner:

## Artifact Build

- [ ] Version fields updated
- [ ] Changelog/readme stable tag updated where applicable
- [ ] Build command recorded:
- [ ] Artifact path:
- [ ] Artifact size:
- [ ] Artifact checksum:

## Package Checks

- [ ] Single expected top-level folder
- [ ] Version headers match
- [ ] No private/agent/local files
- [ ] No dev-only sources or build configs that should be excluded
- [ ] Required built assets are present
- [ ] Theme Check or Plugin Check result recorded where applicable

## Local Integration

- [ ] `style-manager.local` or equivalent integration site checked
- [ ] Relevant stack row selected:
  - [ ] Bare theme
  - [ ] Free onboarding
  - [ ] Public design stack
  - [ ] Commercial stack
  - [ ] Update path
- Evidence:

## Fresh Studio Archive Smoke

- [ ] Brand-new Studio site created
- [ ] Generated ZIP installed through WordPress installer path
- [ ] Frontend checked
- [ ] Admin dashboard checked
- [ ] Site Editor checked where relevant
- [ ] Single/archive or product-specific pages checked
- [ ] Browser console/PHP errors reviewed
- [ ] Temporary Studio site stopped and deleted with files

Evidence:

- Studio path:
- URL:
- ZIP installed:
- Cleanup result:

## Publication

- [ ] GitHub release/tag verified, if applicable
- [ ] WordPress.org SVN/Trac/direct download verified, if applicable
- [ ] WordPress.org API/listing propagation status recorded, if applicable
- [ ] WUpdates product/current version/served ZIP verified, if applicable

Evidence:

- GitHub release:
- WordPress.org Trac:
- WordPress.org SVN:
- WordPress.org download:
- WUpdates:

## Post-Release

- [ ] Release notes published
- [ ] Official package replay smoke completed if release risk requires it
- [ ] Issues closed or moved
- [ ] Milestone closed if complete
- [ ] Private cockpit notes updated with reusable lessons only
