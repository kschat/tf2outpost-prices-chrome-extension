var UpdatePricesCommand = function() {
	this.type = 'UpdatePricesCommand';
	this.url = null;
	this.method = 'GET';
	this.key = null;
	this.startEvent = 'prices:update:loading';
	this.noContentEvent = 'prices:update:noContent';
	this.successEvent = 'prices:update:success';
	this.errorEvent = 'prices:update:fail';
};