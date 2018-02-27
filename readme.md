# What does is-up-to-date do?

is-up-to-date synchronously checks that arbitrary target file is more recent than all source files matching glob patterns.

# Installation

```
npm i is-up-to-date -D
```

# Usage

Let's say you have an expensive custom "code generator", which builds ``dist/generated.js`` from ``.txt`` files in data directory.

You can make it build only if source TXT files in data folder changed:

```javascript
const isUpToDate = require('is-up-to-date');
if (!isUpToDate('data/*.txt', 'dist/generated.js') {
    // Go ahead and build generated.js from the txt files
}

```

# When NOT to use it?

If you are using popular compilers, transpilers, they probably have built-in mechanism for incremental build. It is likely that they do much more granular job handling your incremental build.
