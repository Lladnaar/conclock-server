const settingsLocal = await import('./settings-local.ts')
    .catch(() => ({})); // Fallback to empty object if local settings cannot be loaded

const settingsDefault = {
	port: 9000,
    appfiles: 'app'
};

const settings = {...settingsDefault, ...settingsLocal};
export default settings;
