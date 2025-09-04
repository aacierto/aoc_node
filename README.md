# AOC Node

A minimal Node.js web app with frontend and GitHub Actions workflow.

## Project Structure

```
aoc_node/
├── server.js
├── package.json
├── public/
│   └── index.html
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## Usage

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```
3. Visit [http://localhost:3000](http://localhost:3000).

## Deployment

Customize `.github/workflows/deploy.yml` with your deployment steps.
