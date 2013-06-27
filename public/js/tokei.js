jQuery(document).ready(function() {
  var TokeiViewModel = function(data) {
    var self = this;

    self.url = ko.observable();
    self.tokei = ko.observable();
    self.bio = ko.observable();
    self.name = ko.observable();
    self.title = ko.observable();
    self.taken_by = ko.observable();

    self.fontSize = ko.observable('128px');

    self.top = ko.computed(function() {
      return self.tokei().top() + 'px';
    }, self);

    self.left = ko.computed(function() {
      return self.tokei().left() + 'px';
    }, self);

    self.color = ko.computed(function() {
      return self.tokei().color();
    }, self);

    self.fontFamily = ko.computed(function() {
      if (self.tokei().font) {
        var fontName = self.tokei().font();
        WebFont.load({
          google: {
            families: [fontName]
          }
        });
        return fontName;
      } else {
        return 'Open Sans';
      }
    }, self);

    ko.mapping.fromJS(data, {}, self);
  };

  var ViewModel = function() {
    var self = this;
    var mapping = {
      info: {
        create: function(options) {
          return new TokeiViewModel(options.data);
        },
        key: function(data) {
          return ko.utils.unwrapObservable(data.id);
        }
      }
    };

    self.isTimerMode = function() {
      return $('body').data('timer-mode') == 'timer';
    }

    self.moment = ko.observable(moment());
    self.local = ko.computed(function() {
      return self.moment().local();
    }, self);

    if (self.isTimerMode()) {
      self.gongedAt        = ko.observable();
      self.timeLimit       = $('body').data('time-limit');
      self.momentInterval  = 100 ;
      self.refleshInterval = 30 * 1000;

      self.timerStart = function() {
        self.gongedAt(self.moment().local().add('seconds', self.timeLimit));
      };

      self.timerStop = function() {
        self.gongedAt(null);
        $('.countdown-box').hide();
      };

      self.timeLeft = ko.computed(function() {
         if (self.gongedAt()) {
           var left = self.gongedAt().diff(self.moment(), 'seconds');
           if (0 < left && left <= 10) {
             $('.countdown-box').show();
           }
           if (left < 0) {
             self.timerStop();
             left = 0;
           }
           return left;
         } else {
           return self.timeLimit;
         }
      }, self) ;

      self.leftMinute = ko.computed(function() {
        return Math.floor(self.timeLeft() / 60);
      }, self).extend({notifyOnlyChanged: true});

      self.leftSecond = ko.computed(function() {
        return self.timeLeft() % 60;
      }, self).extend({notifyOnlyChanged: true});

      self.formattedLeftSecond = ko.computed(function() {
        var sec = self.leftSecond();
        if (sec < 10) {
          sec = '0' + sec;
        }
        return sec;
      }, self).extend({notifyOnlyChanged: true});

      self.colonVisibility = ko.computed(function() {
        if (self.gongedAt()) {
          return self.local().milliseconds() > 500 ? 'visible' : 'hidden';
        } else {
          return 'visible';
        }
      }, self);
    } else {
      self.momentInterval  = 1000 ;
      self.refleshInterval = 60 * 1000;
      self.colonVisibility = ko.computed(function() {
        return self.local().second() % 2 === 0 ? 'visible' : 'hidden';
      }, self);
    }

    self.pinnedId = ko.observable();

    setInterval(function() {
      self.moment(moment());
    }, self.momentInterval);

    self.hour = ko.computed(function() {
      return self.local().format('HH');
    }, self).extend({notifyOnlyChanged: true});

    self.minute = ko.computed(function() {
      return self.local().format('mm');
    }, self).extend({notifyOnlyChanged: true});

    self.info = ko.observableArray();

    self.pinned = ko.computed(function() {
      var list = self.info();
      if (self.pinnedId()) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].id() === self.pinnedId()) {
            return list[i];
          }
        }
      }
      return null;
    }, self);

    self.tokeiForMoment = function(moment, offset) {
      var list = self.info();
      if (list.length === 0) {
        return null;
      }
      if (self.pinned()) {
        return self.pinned();
      }
      var number = (Math.floor(moment.unix() / 60) + offset) % list.length;

      return list[number];
    };

    self.current = ko.computed(function() {
      return self.tokeiForMoment(self.moment(), 0);
    }, self).extend({notifyOnlyChanged: true});

    self.current.subscribe(function() {
      var next = self.tokeiForMoment(self.moment(), 1);
      if (next) {
        (new Image()).src = next.url(); // try to prefetch
      }
    });

    self.refreshInfo = function() {
      $.get('/data.json').done(function(data) {
        ko.mapping.fromJS({info: data}, mapping, self);
      });
    };
    self.refreshInfo();
    setInterval(self.refreshInfo, self.refleshInterval);
  };

  var boundingWidth = 1024;
  var boundingHeight = 1024;

  var resize = function(box) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scaleX = windowWidth / box.width();
    var scaleY = windowHeight / box.height();
    var scale = Math.min(scaleX, scaleY);
    var fitWidth = box.width() * scale;
    var fitHeight = box.height() * scale;
    var top  = (windowHeight - fitHeight) / scale / 2;
    var left = (windowWidth  - fitWidth ) / scale / 2;
    box.css({
      zoom: scale,
      '-moz-transform': 'translate(-50%,-50%) scale(' + scale + ') translate(50%,50%)',
      marginTop: top,
      marginLeft: left
    });
  };

  ko.bindingHandlers['tokei'] = {
    init: function(element, valueAccesor, allBindingsAccessor) {
      if ($('.countdown-box').length > 0) {
        $('.countdown-box').css('font-size', $(window).height());
        $('.countdown-box').hide();
      }
      $('.loading-box', element).hide();
      $(window).resize(function() {
        resize($('.tokei-box', element));
      });
      return ko.bindingHandlers['with'].init.apply(this, arguments);
    },
    update: function(element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var returnValue = ko.bindingHandlers['with'].update.apply(this, arguments);
      var box = $('.tokei-box', element);
      var loading = $('.loading-box', element);

      if (value) {
        loading.fadeIn().css({marginTop: ($(window).height() - loading.height()) / 2});
        box.hide();
        $('img.tokei-image', box).remove();
        var image = new Image();
        image.src = value.url();
        image.onload = function() {
          var originalWidth = image.width;
          var originalHeight = image.height;

          var cropTop = 0;
          var cropLeft = 0;
          var cropWidth = originalWidth;
          var cropHeight = originalHeight;
          if (value.cropbox) {
            if (value.cropbox.top) {
              cropTop = value.cropbox.top();
            }
            if (value.cropbox.left) {
              cropLeft = value.cropbox.left();
            }
            if (value.cropbox.width) {
              cropWidth = value.cropbox.width();
            }
            if (value.cropbox.height) {
              cropHeight = value.cropbox.height();
            }
          }

          var scaleX = boundingWidth / cropWidth;
          var scaleY = boundingHeight / cropHeight;
          var scale = Math.min(scaleX, scaleY);
          var fitWidth = cropWidth * scale;
          var fitHeight = cropHeight * scale;

          $(image).css({
            top: -cropTop,
            left: -cropLeft,
            width: fitWidth * originalWidth / cropWidth,
            height: fitHeight * originalHeight / cropHeight
          });
          $(image).addClass('tokei-image');
          box.append(image);
          box.width(fitWidth).height(fitHeight);
          resize(box);
          loading.hide();
          box.fadeIn();
        };
      } else {
        $(box).fadeOut();
      }
      return returnValue;
    }
  };

  ko.extenders.notifyOnlyChanged = function(target) {
    var lastValue = ko.observable();
    var result = ko.computed(function() {
      return lastValue();
    });

    lastValue(target());
    target.subscribe(function() {
      if (target() !== lastValue()) {
        lastValue(target());
      }
    });

    return result;
  };

  var viewModel = new ViewModel();
  var id = location.hash.replace(/^#/, '');
  viewModel.pinnedId(id);
  ko.applyBindings(viewModel);
});
