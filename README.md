# Coursera Foundations of Nodejs and Expressjs

A small Express and Mongoose API.

## Development

Requirements: Node.js 20.6 or newer and a MongoDB instance.

Install dependencies:

```sh
npm install
```

Configure these environment variables in `.env` at the project root:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DATABASE=your_database_name
SECRET_KEY=your_secret_value
```

Keep `.env` and its secret value out of version control. Start the server with automatic restarts when files change:

```sh
node --watch --env-file=.env src/index.js
```

The server uses port `3000` by default; set `PORT` in the environment to use a different port. The MongoDB connection must be available when the server starts.

There is currently no configured `dev` script or test suite in `package.json`; `npm test` is only a placeholder and exits with an error.
