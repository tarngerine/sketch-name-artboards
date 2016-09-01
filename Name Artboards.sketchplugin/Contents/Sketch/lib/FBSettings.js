// FBSettings
// Settings class via NSUserDefaults

// Usage
// 1. Create an FBSettings instance using FBSettings.pluginSettings(pluginKey)
// 2. Refer to it throughout your code for any settings you need within
//    via a settingsKey in updateSetting and getSetting

const FBSettings = function(pluginIdentifier, pluginKey) {
  // PUBLIC
  // Updates/creates a setting for a settingsKey
  this.updateSetting = function(settingsKey, settingsValue) {
    var settings = getSettingsDict();
    settings[settingsKey] = settingsValue;
    setUserDefault(pluginKey, settings);
  }

  // PUBLIC
  // Returns a setting for a settingsKey. Returns nil if it doesn't exist
  this.getSetting = function(settingsKey) {
    const settings = getSettingsDict();
    return settings[settingsKey] ? settings[settingsKey] : nil;
  }

  // PRIVATE
  // Return a settings dictionary for the plugin.
  // Creates it if it doesn't exist.
  const getSettingsDict = function() {
    var settings = getUserDefault(pluginKey);
    if (settings) {
      // NSUserDefaults returns an immutable dict = need to copy it manually
      var mutableSettings = [[NSMutableDictionary alloc] init];
      for(var key in settings) {
        mutableSettings[key] = settings[key];
      }
      settings = mutableSettings;
    } else {
      // Create new settings dict
      settings = [[NSMutableDictionary alloc] init];
    }

    return settings;
  }

  // PRIVATE
  // Returns a user default for the given key
  const getUserDefault = function(key) {
    const defaults = [NSUserDefaults standardUserDefaults];
    const defaultValue = [defaults objectForKey:pluginIdentifier + '.' + key];
    return defaultValue;
  }

  // PRIVATE
  // Sets a user default for the given key under the plugin identifier
  const setUserDefault = function(key, value) {
    const defaults = [NSUserDefaults standardUserDefaults];
    const response = [defaults setObject: value forKey:pluginIdentifier + '.' + key];
    [defaults synchronize];
    return response;
  }
}

FBSettings.pluginSettings = function(pluginIdentifier, pluginKey) {
  return new FBSettings(pluginIdentifier, pluginKey);
}