# Fix Hooks Order Violation in app/dashboard/layout.tsx

## Status: [COMPLETED]

## Steps:
- [ ] 1. Create TODO.md with plan breakdown ✅
- [ ] 2. Edit app/dashboard/layout.tsx: Move all hooks (useState, usePathname, useWeb3) and navItems computation to top of AuthenticatedLayout before any early returns.
- [ ] 3. Verify edit: No syntax errors, preserves indentation/styles/functionality.
- [ ] 4. Test: Run dev server, confirm console error gone, sidebar toggle/nav work on desktop/mobile.
- [ ] 5. Mark complete and attempt_completion.

## Details:
- Root cause: useState line 42 after conditional returns.
- Fix: Hoist hooks per React Rules of Hooks.
- No deps/installs needed.

Updated on: Current timestamp
