const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { detect } = require("detect-port");

// Read the YAML config to get the env file name
// TODO: make this a param
const yamlPath = path.join(__dirname, "../quickstart", "quickstart-login.yaml");
const quickstartConfig = yaml.load(fs.readFileSync(yamlPath, "utf8"));
const envFileName = quickstartConfig.envSnippet?.fileName || ".env.local";

require("dotenv").config({ path: path.join(__dirname, "..", envFileName) });

const PORT = process.env.PORT || 3000;

detect(PORT)
  .then((port) => {
    if (port !== parseInt(PORT)) {
      console.error(`
❌ The port ${PORT} that is configured in Auth0 is currently in use.

To resolve this issue:
1. Free up port ${PORT} by stopping the application using it, OR
2. Configure URLs with a new port in your Auth0 application settings:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
   Then update the PORT environment variable accordingly
`);
      process.exit(1);
    }
    console.log(`✅ Port ${PORT} is available.`);
  })
  .catch((err) => {
    console.error("Error checking port availability:", err);
    process.exit(1);
  });
