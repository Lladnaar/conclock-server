const settingsLocal = await import('./settings-local.ts')
    .then(module => module.default)
    .catch(() => ({})); // Fallback to empty object if local settings cannot be loaded

const settingsDefault = {
	port: 9000,
    appfiles: 'app'
};

const settings = {...settingsDefault, ...settingsLocal};
export default settings;

/* To create local setting overrides, copy the below sample and save as settings-local.ts

--- BEGIN COPY ---
const settings = {
    setting: "value"
};

export default settings;
--- END COPY --- */
