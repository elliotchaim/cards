// Generated by CoffeeScript 1.10.0
(function() {
  var browserRaf, canceled, i, len, ref, targetTime, vendor;

  ref = ['ms', 'moz', 'webkit', 'o'];
  for (i = 0, len = ref.length; i < len; i++) {
    vendor = ref[i];
    if (window.requestAnimationFrame) {
      break;
    }
    window.requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
  }

  if (window.requestAnimationFrame) {
    if (window.cancelAnimationFrame) {
      return;
    }
    browserRaf = window.requestAnimationFrame;
    canceled = {};
    window.requestAnimationFrame = function(callback) {
      var id;
      return id = browserRaf(function(time) {
        if (id in canceled) {
          return delete canceled[id];
        } else {
          return callback(time);
        }
      });
    };
    window.cancelAnimationFrame = function(id) {
      return canceled[id] = true;
    };
  } else {
    targetTime = 0;
    window.requestAnimationFrame = function(callback) {
      var currentTime;
      targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
      return window.setTimeout((function() {
        return callback(+(new Date));
      }), targetTime - currentTime);
    };
    window.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }

}).call(this);