#!/bin/sh

echo "IBEX T4 Git Evidence"
echo
echo "Branch:"
git status -sb
echo
echo "Recent commits:"
git log --oneline --decorate -12
echo
echo "Tags:"
git tag --list | sort
echo
echo "Remote:"
git remote -v
echo
echo "Files T4:"
find docs/t4 scripts/t4 services/notifications-service -maxdepth 2 -type f | sort
echo
echo "GIT_EVIDENCE_DONE"
