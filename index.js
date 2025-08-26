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
execSync(`cd ${projectName} && npm create vite@latest client -- --template react`, {stdio: 'inherit'});
