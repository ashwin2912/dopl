# Bio Format Guide

## How Your Google Doc Should Be Formatted

Your Google Doc should have this structure:

```
BIO:
Your Full Name
Additional bio content here...

RESUME:
Your resume content here...
```

## Examples

### Example 1: Name on First Line
```
BIO:
Alex Johnson
I'm a software engineer passionate about AI and web development. 
I love building products that solve real problems.

RESUME:
...
```

**Result**: Header will show "Alex Johnson" with the full bio below.

---

### Example 2: Name in Sentence
```
BIO:
I'm Sarah Chen, a product designer based in San Francisco.
I'm passionate about creating intuitive user experiences.

RESUME:
...
```

**Result**: Header will show "Sarah Chen" with the full bio below.

---

### Example 3: No Name Extraction
```
BIO:
A passionate developer with 5 years of experience in full-stack development.
I specialize in React, Node.js, and cloud technologies.

RESUME:
...
```

**Result**: Header will show "DIGITAL TWIN" with the bio below.

---

## Tips

- **First line as name** (recommended): Put your full name on the first line after "BIO:"
- The app will try to extract your name automatically from phrases like "I'm [Name]" or "My name is [Name]"
- If first line is longer than 50 characters, it won't be used as the name
- The entire bio section will be displayed in a centered box on the page
- Keep bio concise but informative (2-4 paragraphs is ideal)
