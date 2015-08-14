var priceProvider = (function($) {
  'use strict';

  var _prices = null;

  var _paintPrices = {};

  var _currencyRates = {};

  var _includePaint = false;

  var _useBudsAsCurrency  = false;

  var _minRefreshInterval = 5;

  var _defindexMapping = {
    0: 190,
    1: 191,
    2: 192,
    3: 193,
    4: 194,
    5: 195,
    6: 196,
    7: 197,
    8: 198,
    9: 10,
    10: 199,
    11: 199,
    12: 199,
    13: 200,
    14: 201,
    15: 202,
    16: 203,
    17: 204,
    19: 206,
    22: 209,
    23: 209,
    25: 737,
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

  var _paintMapping = {
    '729E42': 5027,
    '424F3B': 5028,
    '51384A': 5029,
    'D8BED8': 5030,
    '7D4071': 5031,
    'CF7336': 5032,
    'A57545': 5033,
    'C5AF91': 5034,
    '694D3A': 5035,
    '7C6C57': 5036,
    'E7B53B': 5037,
    '7E7E7E': 5038,
    'E6E6E6': 5039,
    '141414': 5040,
    'B8383B': 5046, //double color
    'FF69B4': 5051,
    '2F4F4F': 5052,
    '808000': 5053,
    '32CD32': 5054,
    'F0E68C': 5055,
    'E9967A': 5056,
    '483838': 5060, //double color
    'A89A8C': 5061, //double color
    '3B1F23': 5062, //double color
    '654740': 5063, //double color
    '803020': 5064, //double color
    'C36C2D': 5065, //double color
    'BCDDB3': 5076,
    '2D2D24': 5077
  };

  function getPrice(hash, paint) {
    getPrice.cache = getPrice.cache || {};

    var price = getPrice.cache[hash] || (function() {
      var item = hash.split(',');
      var game = item[0];
      var defIndex = item[1];
      var quality = item[2] || '6';
      var tradable = (!!parseInt(item[3] || 1, 10) ? '' : 'Non-') + 'Tradable';
      var craftable = (!!parseInt(item[4] || 1, 10) ? '' : 'Non-') + 'Craftable';
      var pIndex = item[5] || '0';
      var isAustralium = parseInt(item[6], 10) || '';
      var price = null;

      defIndex = _defindexMapping[defIndex] || defIndex;

      price = (function() {
        switch(parseInt(defIndex, 10)) {
          case 90000: return 'offer';
          case 90001: return 'game';
          case 90002: return '$ \u20AC \u00A3';
          case 90003: return '1.33 ref';
          case 90004: return '0.11 ref';
          case 94000: return 'Any item';
          default: return parseInt(game, 10) === 753
            ? 'gift'
            : null;
        }
      })();

      if(defIndex && isAustralium) { defIndex += 'a'; }

      try {
        return getPrice.cache[hash] = price || _prices[defIndex].prices[quality][tradable][craftable][pIndex].value_raw;
      }
      catch(ex) {
        return '???';
      }
    })();

    if(price && price !== '???' && _includePaint && paint) {
      price += _paintPrices[paint] || 0;
    }

    return price;
  }

  function convertCurrency(value) {
    if(isNaN(value) || !value.toFixed) { return value; }

    if(value > _currencyRates.keys && (value <= _currencyRates.buds || !_useBudsAsCurrency)) {
      value = (value / _currencyRates.keys).toFixed(2);
      return value + ' key' + (value == 1.00 ? '' : 's');
    }

    if(_useBudsAsCurrency && value > _currencyRates.buds) {
      value = (value / _currencyRates.buds).toFixed(2);
      return value + ' bud' + (value == 1.00 ? '' : 's');
    }

    return value.toFixed(2) + ' ref';
  }

  champ.events
    .on('app:init', function(settings) {
      if(settings.initialSetup) { return; }

      _prices = JSON.parse(localStorage.getItem('tf2ItemList'));
      _includePaint = settings.includePaint;

      for(var i in _paintMapping) {
        _paintPrices[i] = getPrice('440,' + _paintMapping[i] + ',6');
      }

      _currencyRates = {
        keys: getPrice('440,5021,6'),
        buds: getPrice('440,143')
      };
    })

    .on('background:price:update', function(prices) {
      _prices = prices;
      getPrice.cache = {};

      localStorage.setItem('tf2ItemList', JSON.stringify(_prices));

      for(var i in _paintMapping) {
        _paintPrices[i] = getPrice('440,' + _paintMapping[i] + ',6');
      }

      _currencyRates = {
        keys: getPrice('440,5021,6'),
        buds: getPrice('440,143')
      };

      champ.events.trigger('priceProvider:update', { status: 'success' });
    })

    .on('background:setting:includePaint', function(includePaint) {
      _includePaint = includePaint;
      getPrice.cache = {};

      champ.events.trigger('priceProvider:update', { status: 'success' });
    })

    .on('background:setting:useBudsAsCurrency', function(useBudsAsCurrency) {
      _useBudsAsCurrency = useBudsAsCurrency;
      getPrice.cache = {};

      champ.events.trigger('priceProvider:update', { status: 'success' });
    });

  return {
    get: getPrice,
    convertCurrency: convertCurrency
  };
})(jQuery);

