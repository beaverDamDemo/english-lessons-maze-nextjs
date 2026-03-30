# Copilot Instructions

## Version Bump Policy

- When bumping the app version, always update `package.json` `version`.
- Ensure the footer version shown in the UI matches `package.json`.
- Preferred implementation: keep a single shared footer component that reads version directly from `package.json`.
- If any page still uses a hardcoded version constant, update that constant in the same change.

## Release Cadence Preference

- Do not bump version for every tiny change.
- Batch version bumps to roughly once every 5 fixes/chats unless explicitly requested.

## Validation Checklist After Version Bump

- Confirm `package.json` contains the new version.
- Confirm footer displays the same version on home and map pages.
- Run a quick type/lint error check on changed files.
