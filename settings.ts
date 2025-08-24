const settingsLocal = await import('./settings-local.ts')
    .catch(() => ({})); // Fallback to empty object if local settings cannot be loaded

const settingsDefault = {
	serverPort: 9000,
    appPath: 'app'
};

const settings = {...settingsDefault, ...settingsLocal};
export default settings;
