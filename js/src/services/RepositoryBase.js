var Repository = (function() {
	var _proto = {
		get: function(prop, query, callback) {
			if(typeof query === 'function') { return this.get(prop, '*', query); }
			prop = prop === '*' ? null : prop;

			chrome.storage.sync.get(prop, function(storage) {
				if(chrome.runtime.lastError) { return callback(chrome.runtime.lastError, null); }

				this._cache = !prop ? storage : storage[prop];
				callback(null, query.trim() === '*' ? this._cache : this._cache[query]);
			}.bind(this));
		},

		update: function(root, prop, value, callback) {
			if(!this._cache) { return this.get('*', this.update.bind(this, prop, value, callback)); }

			var storage = {};
			champ.namespace.call(storage, root, champ.extend({}, this._cache));

			if(typeof prop === 'object') {
				callback = value;
				champ.extend(storage[root], prop);
			}
			else {
				storage[root][prop] = value;
			}

			chrome.storage.sync.set(storage, function() {
				if(chrome.runtime.lastError) { return callback(chrome.runtime.lastError, null); }
				
				this._cache = storage[root];
				callback(null, storage[root]);
			}.bind(this));
		}
	};

	return {
		create: function(type) {
			var _newRepo = { _cache: null };

			for(var key in _proto) {
				_newRepo[key] = _proto[key].bind(_newRepo, type);
			}

			return Object.create(_newRepo);
		}
	};

})();