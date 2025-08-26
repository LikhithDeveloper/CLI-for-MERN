// required libraries  
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

console.log("Starting setuping MERN stack project...");

if(process.argv.length < 2){
    console.log("Please provide the project name");
    process.exit(1);
}
const projectName = process.argv[2] || "MERN_Project";
execSync(`mkdir ${projectName}`, {stdio: 'inherit'});
execSync(`cd ${projectName} && npm create vite@latest client -- --template react && cd client && npm install`, {stdio: 'ignore'});
execSync(`cd ${projectName}/client && npm install tailwindcss @tailwindcss/vite`, {stdio: 'inherit'});
fs.writeFileSync(
    `${projectName}/client/vite.config.js`,
    `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
plugins: [
    react(),
    tailwindcss(),
],
})
    `
);

// add Tailwind import in App.css
const styleData = fs.readFileSync(`${projectName}/client/src/App.css`, 'utf8');
fs.writeFileSync(
  `${projectName}/client/src/App.css`,
  `@import "tailwindcss";\n${styleData}`
);

console.log("React client setup done!");

console.log("Setting up Node/Express server...");
execSync(`cd ${projectName} && mkdir server`, {stdio: 'ignore'});
execSync(`cd ${projectName}/server && npm init -y`)
fs.writeFileSync(
    `${projectName}/server/package.json`,
    `
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
}
    `
);
execSync(`cd ${projectName}/server && npm i express && npm i mongoose && npm i cors && npm i dotenv`, {stdio: 'ignore'});
fs.writeFileSync(
    `${projectName}/server/.env`,
    `
MONGO_URI=your_mongodb_connection_string
PORT=3000
    `    
)
fs.writeFileSync(
    `${projectName}/server/index.js`,
    `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
});
    `
);
