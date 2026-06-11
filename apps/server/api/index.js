// Vercel serverless entry point — exports the compiled Express app.
// `buildCommand` in vercel.json compiles src/ → dist/ before this runs.
const app = require('../dist/app')

module.exports = app.default || app
