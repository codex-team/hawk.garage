module.exports = {
	pwa: {
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: 'public/serviceWorker.js'
		}
	}
};