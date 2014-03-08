var priceProvider = (function($) {
	var _prices = null,
		_minRefreshInterval = 5,
	    _getElapsedTime = function() { return Math.floor((Date.now() - localStorage.getItem('tf2LastUpdate')) / 60 / 1000); },
		defindexMapping = {
	        0: 190,
	        1: 191,
	        2: 192,
	        3: 193,
	        4: 194,
	        5: 195,
	        6: 196,
	        7: 197,
	        8: 198,
	        9: 199,
	        10: 199,
	        11: 199,
	        12: 199,
	        13: 200,
	        14: 201,
	        15: 202,
	        16: 203,
	        17: 204,
	        19: 206,
	        20: 207,
	        21: 208,
	        22: 209,
	        23: 209,
	        24: 210,
	        25: 737,
	        29: 211,
	        30: 212,
	        160: 294,
	        735: 736,
	        831: 810,
	        832: 811,
	        833: 812,
	        834: 813,
	        835: 814,
	        836: 815,
	        837: 816,
	        838: 817,
	        5999: 6000
	    };

	return {
		get: function getPrice(hash) {
			_prices = _prices || JSON.parse(localStorage.getItem('tf2ItemList'));
			getPrice.cache = getPrice.cache || {};

			return getPrice.cache[hash] || (function() {
				var item = hash.split(','),
					price = null;

				item[1] = defindexMapping[item[1]] || item[1];

				switch(parseInt(item[1], 10)) {
					case 90000:
						price = 'offer';
						break;
					case 90001:
						price = 'game';
						break;
					case 90002:
						price = '$ \u20AC \u00A3';
						break;
					case 90003:
						price = '1.33 ref';
						break;
					case 90004:
						price = '0.11 ref';
						break;
					case 94000:
						price = 'Any item';
						break;
					default:
						if(parseInt(item[0], 10) === 753) { price = 'gift'; }
						break;
				}

				try {
					return getPrice.cache[hash] =  price || _prices[item[1]][item[2]][item[3] || 0].value;
				}
				catch(ex) {
					return '???';
				}
			})();
		},

		update: function() {
			if(localStorage.getItem('tf2LastUpdate') && _getElapsedTime() < _minRefreshInterval) { return; }

			var request = $.ajax({
				url: 'http://backpack.tf/api/IGetPrices/v2/?key=514ce50eba2536c86e000006',
				type: 'GET'
			});

			request.done(function(data) {
				_prices = data.response.prices;
				this.get.cache = {};
				
				localStorage.setItem('tf2ItemList', JSON.stringify(_prices));
				localStorage.setItem('tf2LastUpdate', Date.now());
				champ.events.trigger('priceProvider:update', { status: 'success' });
			}.bind(this));

			request.fail(function(jqXhr, textStatus, errorThrown) {
				champ.events.trigger('priceProvider:update:fail', { status: jqXhr.status });
			});
		}
	}
})(jQuery);