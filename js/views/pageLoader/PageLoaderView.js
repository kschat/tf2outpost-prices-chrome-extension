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
            //this.render();
        },
        model:      PageLoaderModel,
        events: {

        },
        template:   _.template(PageLoaderTemplate),
        render:             function() {
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
                this.model.set('message', 'Never ending tf2outpost is enabled - scroll to load the next page');
            }
            else {
                $(this.el).children('.loader-message').html('Nothing else to load');
            }
        },
    });

    return PageLoaderView;
});