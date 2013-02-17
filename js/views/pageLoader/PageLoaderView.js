define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pageLoader/pageLoaderTemplate.html',
    'models/pageLoader/PageLoaderModel'
], function($, _, Backbone, PageLoaderTemplate, PageLoaderModel) {
    var PageLoaderView = Backbone.View.extend({
        initialize:         function() {
            this.model.bind('change:message', this.render, this);
            _.bindAll(this, 'detectBottomOfPage');
            this.render();
        },
        model:      PageLoaderModel,
        events: {

        },
        template:   _.template(PageLoaderTemplate),
        render:             function() {
            console.log(this.el);
            this.$el.empty();
            this.$el.html(this.template(this.model.attributes));

            return this;
        },
        detectBottomOfPage: function() {
            if($(window).innerHeight() + $(window).scrollTop() >= $('body').height()) {
                this.sendPageRequest();
                return true;
            }

            return false;
        },
        constructUrl:       function() {
            var currentPage = this.model.get('currentPage'),
                page = '/',
                pageNum = this.model.get('pageNumber');

            if(currentPage === '/') {
                page = '/recent/2';
            }
            else {
                var pageName = currentPage.split('/');
                
                if(pageName[pageName.length - 1] === '20') {
                    page = '/';
                    pageNum = 0;
                }
                else if(isNaN(pageName[pageName.length - 1])) {
                    page = '/' + pageName[pageName.length - 1] + '/2';
                    pageNum = 1;
                }
                else {
                    page = '/' + pageName[pageName.length - 2] + '/' + (parseInt(currentPage.split('/')[2], 10) + 1);
                    pageNum++;
                }
            }
            this.model.set('pageNumber', pageNum);
            this.model.set('currentPage', page);

            return page;
        },
        sendPageRequest:    function() {
            //this.pageNumber = this.updatePageNumber();
            //console.log(this.pageNumber);
            var xhr = new XMLHttpRequest();

            //closure #swag
            xhr.onreadystatechange = (function(that, xhr) {
                return function() {
                    if(xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            that.loadNextPage(xhr.responseText);
                        }
                    }
                };
            })(this, xhr);

            //Builds the URI to send to the server
            var page = this.constructUrl();
            //If the pathname is the root, we know we're on the first page on the home page
            //if(this.currentPage === '/') {
           //     page = '/recent/2';
           // }
           // else {
                //page = this.currentPage;
                //var pageName = page.split('/');
                //If the current page is 20 then we have hit the last page and need to
                //start from the beginning
                //if(pageName[pageName.length - 1] == '20') {
                //    page = '/';
                //}
                //else if(isNaN(pageName[pageName.length - 1])) {
                //    //page = '/' + pageName[pageName.length - 1] + '/2';
                //}
                //else {
                    //Otherwise set the page to the pageName and the current page number + 1
                    //page = '/' + pageName[pageName.length - 2] + '/' + (parseInt(page.split('/')[2], 10) + 1);
                //}
           // }

            //this.currentPage = page;
            console.log('http://www.tf2outpost.com' + page);
            xhr.open('GET', 'http://www.tf2outpost.com' + page);
            xhr.send(null);
            this.model.set('message', 'loading...');
        },
        loadNextPage: function(page) {
            //Grab every trade from the loaded and page and inject them before the
            //loading element
            var trades = $(page).find('.trade');
            var items = trades.find('.item');
            var tempElements = [];

            if(trades.length > 0) {
                $(this.el).before('<div class="never-ending-loader">Page: ' + this.model.get('pageNumber') + '</div>').before(trades);
                this.options.renderer($(items));
                //Iterates through each item element and creates a price element containing the text 'loading'
                //items.each(function(index) {
                //    var dataHash = $(this).attr('data-hash');
                //    
                //    if(dataHash) {
                        //tempElements[index] = new PriceElement('loading');
                        //$(this).prepend(tempElements[index].getDOMElement());
                //    }
                //});

                //loadUI(items, tempElements);
            }
            else {
                $(this.el).children('.loader-message').html('Nothing else to load');
            }
        },
    });

    return PageLoaderView;
});

/*
//Object used to control the never ending tf2outpost feature
    var LoadingElement = function(selector) {
        $(selector).after('<div class="notes never-ending-loader"><div class="loader-message"></div></div>')
        this.el = $('.never-ending-loader');
        this.hidePagination(selector);
        this.currentPage = window.location.pathname.toString();
        this.pageNumber = 0;

        this.message = 'Never ending tf2outpost is enabled - scroll to load the next page';
        $(this.el).children('.loader-message').html(this.message);
    }

    //Really needs to be split up into some form of MV*. Probably need to start using backbone.js
    LoadingElement.prototype = {
        hidePagination: function(selector) {
            $(selector).remove();
        },
        updatePageNumber: function() {
            var page = this.currentPage;
            var pageName = page.split('/');

            if(pageName[pageName.length - 1] == '20') {
                this.pageNumber = '1';
            }
            else if(isNaN(pageName[pageName.length - 1]) || pageName[pageName.length - 1] == '') {
                console.log("pageName: " + pageName[pageName.length - 1]);
                this.pageNumber = '2';
            }
            else {
                this.pageNumber = (parseInt(page.split('/')[2], 10) + 1);
            }

            return this.pageNumber;
        },
        detectBottomOfPage: function() {
            if($(window).innerHeight() + $(window).scrollTop() >= $('body').height()) {
                this.sendPageRequest();
                return true;
            }

            return false;
        },
        sendPageRequest: function() {
            this.pageNumber = this.updatePageNumber();
            console.log(this.pageNumber);
            var xhr = new XMLHttpRequest();

            //closure #swag
            xhr.onreadystatechange = (function(that, xhr) {
                return function() {
                    if(xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            that.loadNextPage(xhr.responseText);
                        }
                    }
                };
            })(this, xhr);

            //Builds the URI to send to the server
            var page = '/';
            //If the pathname is the root, we know we're on the first page on the home page
            if(this.currentPage === '/') {
                page = '/recent/2';
            }
            else {
                page = this.currentPage;
                var pageName = page.split('/');
                //If the current page is 20 then we have hit the last page and need to
                //start from the beginning
                if(pageName[pageName.length - 1] == '20') {
                    page = '/';
                }
                else if(isNaN(pageName[pageName.length - 1])) {
                    page = '/' + pageName[pageName.length - 1] + '/2';
                }
                else {
                    //Otherwise set the page to the pageName and the current page number + 1
                    page = '/' + pageName[pageName.length - 2] + '/' + (parseInt(page.split('/')[2], 10) + 1);
                }
            }

            this.currentPage = page;
            xhr.open('GET', 'http://www.tf2outpost.com' + page);
            xhr.send(null);
            $(this.el).children('.loader-message').html('loading...');
        },
        loadNextPage: function(page) {
            //Grab every trade from the loaded and page and inject them before the
            //loading element
            var trades = $(page).find('.trade');
            var items = trades.find('.item');
            var tempElements = [];

            if(trades.length > 0) {
                $(this.el).before('<div class="never-ending-loader">Page: '+ this.pageNumber+'</div>').before(trades);

                //Iterates through each item element and creates a price element containing the text 'loading'
                items.each(function(index) {
                    var dataHash = $(this).attr('data-hash');
                    
                    if(dataHash) {
                        tempElements[index] = new PriceElement('loading');
                        $(this).prepend(tempElements[index].getDOMElement());
                    }
                });

                loadUI(items, tempElements);
            }
            else {
                $(this.el).children('.loader-message').html('Nothing else to load');
            }
        }
    };*/