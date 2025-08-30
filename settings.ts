import fs from "fs";

// Read standard settings from distributed settings.json file

let settingsDefault = {};
try {
    const jsonData = fs.readFileSync("./settings.json");
    settingsDefault = JSON.parse(jsonData);
} catch {
    settingsDefault = {};
    console.error("Error reading settings.json file");
};

// Read local settings from settings-local.json file (if it exists) to override standard settings
// settings-local.json is .gitignored so that local changes are not committed to the repo

let settingsLocal = {};
try {
    const jsonData = fs.readFileSync("./settings-local.json");
    settingsLocal = JSON.parse(jsonData);
} catch {
    settingsLocal = {};
    console.log("Error reading settings-local.json file");
};

const settings = {...settingsDefault, ...settingsLocal};
export default settings;
