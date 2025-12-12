const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Build main project first
console.log("Building main project...");
execSync("tsc", { stdio: "inherit" });

// Build Netlify function (it imports from dist)
console.log("Building Netlify function...");
execSync("tsc --project netlify/functions/tsconfig.json", { stdio: "inherit" });

// Copy compiled app.js and its dependencies to netlify/functions
const srcAppJs = path.join(__dirname, "../dist/src/app.js");
const destAppJs = path.join(__dirname, "../netlify/functions/src/app.js");

if (fs.existsSync(srcAppJs)) {
  // Ensure directory exists
  const destDir = path.dirname(destAppJs);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy app.js
  fs.copyFileSync(srcAppJs, destAppJs);
  console.log("✓ Copied app.js to netlify/functions/src/");
  
  // Find and move server.js to correct location
  const correctServerJs = path.join(__dirname, "../netlify/functions/server.js");
  const nestedServerJs = path.join(__dirname, "../netlify/functions/netlify/functions/server.js");
  const distServerJs = path.join(__dirname, "../dist/netlify/functions/server.js");
  
  let serverJsSource = null;
  if (fs.existsSync(nestedServerJs)) {
    serverJsSource = nestedServerJs;
  } else if (fs.existsSync(distServerJs)) {
    serverJsSource = distServerJs;
  }
  
  if (serverJsSource && !fs.existsSync(correctServerJs)) {
    fs.copyFileSync(serverJsSource, correctServerJs);
    console.log("✓ Moved server.js to correct location");
    
    // Clean up nested directories
    if (fs.existsSync(nestedServerJs)) {
      const nestedDir = path.join(__dirname, "../netlify/functions/netlify");
      if (fs.existsSync(nestedDir)) {
        fs.rmSync(nestedDir, { recursive: true, force: true });
      }
    }
  } else if (!fs.existsSync(correctServerJs)) {
    console.error("Error: server.js not found after compilation");
    process.exit(1);
  }
  
  console.log("✓ Netlify build complete!");
} else {
  console.error("Error: dist/src/app.js not found");
  process.exit(1);
}

