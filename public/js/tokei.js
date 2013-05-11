jQuery(document).ready(function() {
  var ViewModel = function() {
    var self = this;

    self.moment = ko.observable(moment());
    setInterval(function() {
      self.moment(moment());
    }, 1000);

    self.hour = ko.computed(function() {
      return self.moment().local().hour();
    }, self);

    self.minute = ko.computed(function() {
      return self.moment().local().minute();
    }, self);

    self.colonClass = ko.computed(function() {
      return self.moment().local().second() % 2 === 0 ? 'show' : 'hidden';
    }, self);
  };

  ko.applyBindings(new ViewModel());
});
