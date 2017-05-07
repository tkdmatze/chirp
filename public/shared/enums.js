(function(exports){

  class Kpi {
    constructor(config){
      this.key = config.key;
      this.onceASession = (config.onceASession)?config.onceASession:false;
    }

  }
  exports.loadStartSiteLoggedIn = new Kpi({key : "LPLI", onceASession: true });
  exports.loadStartSiteLoggedOut = new Kpi({key : "LPLO", onceASession: true });
  exports.posted = new Kpi({key : "POST", onceASession: false });
 
}(typeof exports === 'undefined' ? this.enums = {} : exports));