

'use strict'

jQuery.noConflict();

(function($) {
    
    var PriceElement = function(price) {
        this.price = price;
        this.el = $('<div></div>')
            .attr({class: 'price'})
            .append('<p>' + this.price + '</p>');
    }
    
    PriceElement.prototype = {
        getDOMElement:  function() {
            return $(this.el);
        },
        updatePrice:    function(price) {
            this.price = price;
            $(this.el).empty().append('<p>' + this.price + '</p>');
        },
        removeElement:  function() {
            $(this.el).remove();
        }
    };
    
    var searchItem = function(item, effect) {
        try {
            if(effect) {
                return prices[item[1]][item[2]][effect];
            }
            
            return prices[item[1]][item[2]][0];
        }
        catch(ex) {
            return 0;
        }
    }
    
    var getItemData = function(dataHash) {
        //Breaks up the data-hash into an array and maps the 3rd value
        var item = dataHash.split(',');
        item[1] = mapDefindexValue(item[1]);
        
        //Item is a wildcard item.
        if(item[1] >= 90000) {
            if(item[1] == 90001) {
                return { value: 'game' };
            }
            else if(item[1] == 90000) {
                return { value: 'offer' };
            }
            else if(item[1] == 90003) {
                return { value: '1.33 ref' };
            }
            else if(item[1] == 90002) {
                return { value: '$$$' };
            }
            else if(item[1] == 90004) {
                return { value: '0.11 ref' };
            }

            return;
        }

        //Item is a game
        if(item[0] == 753) {
            return { value: 'gift' };
        }

        //Item is for DOTA2
        if(item[0] == 570) {
            return;
        }
        //Item is unusual
        if(item[2] == '5') {
            return searchItem(item, item[3]);
        }

        return searchItem(item);
    }
    
    //Would have loved to use regex here but the returned array didn't seem to want 
    //to give me access to the first index. ;_; Have to look more into this later.
    var getUnusualEffect = function(url) {
        var effect = url.toString().split('/');
        effect = effect[effect.length-1].split('.');
        
        return effect[0];
    }
    
    var convertCurrency = function(value) {
        if(isNaN(value) || !value.toFixed) return value;
        
        var keyValue = prices[5021][6][0].value;
        var budsValue = prices[143][6][0].value;
        
        if(value > keyValue && value <= budsValue) {
            value = value / keyValue;
            if(value == 1) {
                return value.toFixed(2) + ' key';
            }
            return value.toFixed(2) + ' keys';
        }
        
        if(value > budsValue) {
            value = value / budsValue;
            if(value == 1) {
                return value.toFixed(2) + ' bud';
            }
            return value.toFixed(2) + ' buds';
        }
        
        return value.toFixed(2) + ' ref';
    }

    var setPriceList = function(list) {
        localStorage['itemList'] = JSON.stringify(list);
    }

    var getPriceList = function() {
        try {
            return JSON.parse(localStorage['itemList']);
        }
        catch(ex) {
            return;
        }
    }
    
    var getLastPriceUpdate = function() {
        try {
            return localStorage['lastUpdate'];
        }
        catch(ex) {
            return;
        }
    }

    var setLastPriceUpdate = function(time) {
        localStorage['lastUpdate'] = time;
    }
    
    var getHoursPassed = function(time1, time2) {
        return (time1 - time2) / 60 / 60;
    }
    
    var getUnixCurrentTime = function() {
        return Math.round((new Date()).getTime() / 1000);
    }
    
    var mapDefindexValue = function(value) {
        if(typeof defindexMapping[value] != 'undefined') {
            return defindexMapping[value];
        }
        
        return value;
    }
    
    var loadUI = function() {
        $('.item').each(function(index) {
            dataHash =  $(this).attr('data-hash');
            
            if(dataHash) {
                //Test to see if the item is uncraftable. Needs to be done because
                //backpack.tf decided that 600 would be a good alteration to the id system.
                if($(this).hasClass('uncraftable')) {
                    dataHash = dataHash.replace(/6$/, '600');
                }
                
                //If the item has a style attribute then we know the unusual has an effect
                if($(this).attr('style')) {
                    dataHash += ',' + getUnusualEffect($(this).attr('style'));
                }
                
                
                //Gets the item data for the current item
                var item = getItemData(dataHash);
                
                //If the item is truthy, add a DOM element with it's price
               if(item) {
                    var price = convertCurrency(item.value);

                    priceElements[index].updatePrice(convertCurrency(item.value));
               }
               else {
                    priceElements[index].removeElement();
               }
            }
        });
    }

    var handleReadyState = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                processData(this.responseText);
            }
        }
    }

    var processData = function(data) {
        //Sets the prices and last time prices were updated to the response from the server
        var list = JSON.parse(data);
        var p = list.response.prices;
        var t = list.response.current_time;

        setPriceList(p);
        setLastPriceUpdate(t);
        prices = getPriceList();
        
        //Loads the price elements
        loadUI();
    }
    
    var prices = getPriceList();
    var lastUpdate = getLastPriceUpdate();
    var priceElements = [];
    var dataHash = undefined;

    //Contains a list of mappings for items that are merged in the price list by backpack.tf
    var defindexMapping = {
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
        18: 205,
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
        5999: 6000,
        2093: 5020
    };

    $(document).ready(function() {
        
        //Iterates through each item element and creates a price element containing the text 'loading'
        $('.item').each(function(index) {
            dataHash =  $(this).attr('data-hash');
            
            if(dataHash) {
                priceElements[index] = new PriceElement('loading');
                $(this).prepend(priceElements[index].getDOMElement());
            }
        });
        
        //Determines if the cached information is there or out of date
        if(typeof prices == 'undefined' || typeof lastUpdate == 'undefined' || getHoursPassed(getUnixCurrentTime(), lastUpdate) >= 1) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = handleReadyState;
            xhr.open('GET', 'http://backpack.tf/api/IGetPrices/v2');
            xhr.send(null);
        }
        else {
            loadUI();
        }
    });
})(jQuery);