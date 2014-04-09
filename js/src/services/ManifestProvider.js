var ManifestProvider = {
	get: function(prop) {
		return !prop 
			? chrome.runtime.getManifest() 
			: chrome.runtime.getManifest()[prop];
	}
};