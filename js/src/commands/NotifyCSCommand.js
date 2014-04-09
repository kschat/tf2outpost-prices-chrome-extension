var NotifyCSCommand = function(options) {
  options = options || {};
  this.type = 'NotifyCSCommand';
  this.action = options.action || '';
  this.message = options.message || '';
};