var priceProvider = (function($) {
  'use strict';

	var _prices = null,
		
    _includePaint = false,

    _minRefreshInterval = 5,
    
    _defindexMapping = {
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
      20: 207,
      21: 208,
      22: 209,
      23: 209,
      //24: 210,
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
    },

    _paintMapping = {
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
    },

    _paintPrices = {};

  function getPrice(hash, paint) {
    getPrice.cache = getPrice.cache || {};

    var price = getPrice.cache[hash] || (function() {
      var item = hash.split(',')
        , game = item[0]
        , defIndex = item[1]
        , quality = item[2] || '6'
        , tradable = (!!parseInt(item[3] || 1, 10) ? '' : 'Non-') + 'Tradable'
        , craftable = (!!parseInt(item[4] || 1, 10) ? '' : 'Non-') + 'Craftable'
        , pIndex = item[5] || '0'
        , price = null;

      defIndex = _defindexMapping[defIndex] || defIndex;

      switch(parseInt(defIndex, 10)) {
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
          if(parseInt(game, 10) === 753) { price = 'gift'; }
          break;
      }

      try {
        return getPrice.cache[hash] = price || _prices[defIndex].prices[quality][tradable][craftable][pIndex].value_raw;
      }
      catch(ex) {
        return '???';
      }
    })();

    if(_includePaint && paint) { price += _paintPrices[paint] || 0; }

    return price;
  }

  champ.events
    .on('app:init', function(settings) {
      if(settings.initialSetup) { return; }

      _prices = JSON.parse(localStorage.getItem('tf2ItemList'));
      _includePaint = settings.includePaint;

      for(var i in _paintMapping) {
        _paintPrices[i] = getPrice('440,' + _paintMapping[i] + ',6');
      }
    })

    .on('background:price:update', function(prices) {
      _prices = prices;
      localStorage.setItem('tf2ItemList', JSON.stringify(_prices));

      for(var i in _paintMapping) {
        _paintPrices[i] = getPrice('440,' + _paintMapping[i] + ',6');
      }

      champ.events.trigger('priceProvider:update', { status: 'success' });
    })

    .on('background:setting:includePaint', function(includePaint) {
      _includePaint = includePaint;
      getPrice.cache = {};

      champ.events.trigger('priceProvider:update', { status: 'success' });
    });

	return { get: getPrice };
})(jQuery);