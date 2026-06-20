# Creating a new subpage: 

1. 
=> pnpm create vite apps/app-name -- --template

2. add this page to the build workflow

=> pnpm add-subpage app-name

# Run a specific app in dev mode: 

=> pnpm --filter app-name dev

if its inside a subfolder, the name changes from 
"folder/app-name" to "folder-app-name"

=> pnpm --filter folder-app-name dev

when trying to run a project within "playground", dont forget that the url is:

=> http://localhost:5173/playground/page-name/index.html

# Install dependency for one app:

=> pnpm --filter app-name add package

# Install for whole workspace

=> pnpm add -D package -w

# Build a all pages: 

=> pnpm build

inside package.json:
"build": "pnpm -r build && node scripts/collect-builds.js",

collect-builds.js collects all build apps into one dist

# Preview the build versions:

=> pnpm preview

# List all sub-pages

=> pnpm list -r --depth -2
