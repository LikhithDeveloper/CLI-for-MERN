#!/usr/bin/env node
// required libraries  
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";


console.log(chalk.cyanBright("Starting setuping MERN stack project...\n"));
if(process.argv.length < 3){
    console.log(chalk.red("Please provide the project name"));
    process.exit(1);
}
const projectName = process.argv[2] || "MERN_Project";
console.log(chalk.blue("Setting up React client with Vite and TailwindCSS..."));
try {
    execSync(`mkdir ${projectName}`, {stdio: 'inherit'});
    execSync(`cd ${projectName} && npm create vite@latest client -- --template react && cd client && npm install`, {stdio: 'ignore'});
    execSync(`cd ${projectName}/client && npm install tailwindcss @tailwindcss/vite`, {stdio: 'ignore'});
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

console.log(chalk.green("React client setup done!"));
} catch (error) {
    console.error(chalk.red("Error during React client setup:"), error);
    process.exit(1);
}

console.log(chalk.blue("Setting up Node/Express server..."));
try {
    execSync(`cd ${projectName} && mkdir server`, {stdio: 'ignore'});
execSync(`cd ${projectName}/server && npm init -y`,{stdio: 'ignore'})
const serverPkg = {
  name: "server",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    test: "echo \"Error: no test specified\" && exit 1",
    start: "node index.js"
  },
  keywords: [],
  author: "",
  license: "ISC",
  type: "commonjs"
};

fs.writeFileSync(
  `${projectName}/server/package.json`,
  JSON.stringify(serverPkg, null, 2) 
);

execSync(`npm i express mongoose cors dotenv`, {
  cwd: `${projectName}/server`,
  stdio: 'ignore'
});

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

console.log(chalk.green("Node/Express server setup done!\n"));
console.log(chalk.cyan("Please follow the steps below to get started:\n"));
console.log(chalk.yellow(`1. cd ${projectName}/client && npm run dev ${chalk.gray("(to start React client)")}`));
console.log(chalk.yellow(`2. cd ${projectName}/server && npm start ${chalk.gray("(to start Express server)")}`));
console.log(chalk.yellow("3. Update the .env file in the server folder with your MongoDB connection string before starting the server.\n"));

console.log(chalk.magentaBright("🎉 Happy coding!"));
} catch (error) {
    console.error(chalk.red("Error during Node/Express server setup:"), error);
    process.exit(1);
}
