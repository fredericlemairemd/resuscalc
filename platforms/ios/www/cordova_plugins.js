cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova-plugin-nativeclicksound.nativeclick",
      "file": "plugins/cordova-plugin-nativeclicksound/www/nativeclick.js",
      "pluginId": "cordova-plugin-nativeclicksound",
      "clobbers": [
        "nativeclick"
      ]
    },
    {
      "id": "cordova-plugin-vibration.notification",
      "file": "plugins/cordova-plugin-vibration/www/vibration.js",
      "pluginId": "cordova-plugin-vibration",
      "merges": [
        "navigator"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-statusbar": "2.4.3",
    "cordova-plugin-nativeclicksound": "0.0.4",
    "cordova-plugin-vibration": "3.1.1"
  };
});