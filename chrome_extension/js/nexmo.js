"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _Credentials = require("./Credentials");

var _Credentials2 = _interopRequireDefault(_Credentials);

var _JwtGenerator = require("./JwtGenerator");

var _JwtGenerator2 = _interopRequireDefault(_JwtGenerator);

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

var _Voice = require("./Voice");

var _Voice2 = _interopRequireDefault(_Voice);

var _Number = require("./Number");

var _Number2 = _interopRequireDefault(_Number);

var _Verify = require("./Verify");

var _Verify2 = _interopRequireDefault(_Verify);

var _NumberInsight = require("./NumberInsight");

var _NumberInsight2 = _interopRequireDefault(_NumberInsight);

var _App = require("./App");

var _App2 = _interopRequireDefault(_App);

var _Account = require("./Account");

var _Account2 = _interopRequireDefault(_Account);

var _CallsResource = require("./CallsResource");

var _CallsResource2 = _interopRequireDefault(_CallsResource);

var _FilesResource = require("./FilesResource");

var _FilesResource2 = _interopRequireDefault(_FilesResource);

var _Conversion = require("./Conversion");

var _Conversion2 = _interopRequireDefault(_Conversion);

var _Media = require("./Media");

var _Media2 = _interopRequireDefault(_Media);

var _Redact = require("./Redact");

var _Redact2 = _interopRequireDefault(_Redact);

var _HttpClient = require("./HttpClient");

var _HttpClient2 = _interopRequireDefault(_HttpClient);

var _NullLogger = require("./NullLogger");

var _NullLogger2 = _interopRequireDefault(_NullLogger);

var _ConsoleLogger = require("./ConsoleLogger");

var _ConsoleLogger2 = _interopRequireDefault(_ConsoleLogger);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var jwtGeneratorInstance = new _JwtGenerator2.default();

var Nexmo = function () {
  /**
   * @param {Credentials} credentials - Nexmo API credentials
   * @param {string} credentials.apiKey - the Nexmo API key
   * @param {string} credentials.apiSecret - the Nexmo API secret
   * @param {Object} options - Additional options
   * @param {boolean} options.debug - `true` to turn on debug logging
   * @param {Object} options.logger - Set a custom logger.
   * @param {string} options.appendToUserAgent - A value to append to the user agent.
   *                    The value will be prefixed with a `/`
   */
  function Nexmo(credentials) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      debug: false
    };

    _classCallCheck(this, Nexmo);

    this.credentials = _Credentials2.default.parse(credentials);
    this.options = options; // If no logger has been supplied but debug has been set
    // default to using the ConsoleLogger

    if (!this.options.logger && this.options.debug) {
      this.options.logger = new _ConsoleLogger2.default();
    } else if (!this.options.logger) {
      // Swallow the logging
      this.options.logger = new _NullLogger2.default();
    }

    var userAgent = "nexmo-node/UNKNOWN node/UNKNOWN";

    try {
      var packageDetails = require(_path2.default.join(__dirname, "..", "package.json"));

      userAgent = "nexmo-node/" + packageDetails.version + " node/" + process.version.replace("v", "");
    } catch (e) {
      console.warn("Could not load package details");
    }

    this.options.userAgent = userAgent;

    if (this.options.appendToUserAgent) {
      this.options.userAgent += " " + this.options.appendToUserAgent;
    } // This is legacy, everything should use rest or api going forward


    this.options.httpClient = new _HttpClient2.default(Object.assign({
      host: "rest.nexmo.com"
    }, this.options), this.credentials); // We have two different hosts, so we use two different HttpClients

    this.options.api = new _HttpClient2.default(Object.assign({
      host: "api.nexmo.com"
    }, this.options), this.credentials);
    this.options.rest = new _HttpClient2.default(Object.assign({
      host: "rest.nexmo.com"
    }, this.options), this.credentials);
    this.message = new _Message2.default(this.credentials, this.options);
    this.voice = new _Voice2.default(this.credentials, this.options);
    this.number = new _Number2.default(this.credentials, this.options);
    this.verify = new _Verify2.default(this.credentials, this.options);
    this.numberInsight = new _NumberInsight2.default(this.credentials, this.options);
    this.applications = new _App2.default(this.credentials, this.options);
    this.account = new _Account2.default(this.credentials, this.options);
    this.calls = new _CallsResource2.default(this.credentials, this.options);
    this.files = new _FilesResource2.default(this.credentials, this.options);
    this.conversion = new _Conversion2.default(this.credentials, this.options);
    this.media = new _Media2.default(this.credentials, this.options);
    this.redact = new _Redact2.default(this.credentials, this.options);
    /**
     * @deprecated Please use nexmo.applications
     */

    this.app = this.applications;
  }
  /**
   * Generate a JSON Web Token (JWT).
   *
   * The private key used upon Nexmo instance construction will be used to sign
   * the JWT. The application_id you used upon Nexmo instance creation will be
   * included in the claims for the JWT, however this can be overridden by passing
   * an application_id as part of the claims.
   *
   * @param {Object} claims - name/value pair claims to sign within the JWT
   *
   * @returns {String} the generated token
   */


  _createClass(Nexmo, [{
    key: "generateJwt",
    value: function generateJwt() {
      var claims = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (claims.application_id === undefined) {
        claims.application_id = this.credentials.applicationId;
      }

      return Nexmo.generateJwt(this.credentials.privateKey, claims);
    }
  }]);

  return Nexmo;
}();
/**
 * Generate a JSON Web Token (JWT).
 *
 * @param {String|Buffer} privateKey - the path to the private key certificate
 *          to be used when signing the claims.
 * @param {Object} claims - name/value pair claims to sign within the JWT
 *
 * @returns {String} the generated token
 */


Nexmo.generateJwt = function (privateKey, claims) {
  if (!_instanceof(privateKey, Buffer)) {
    if (!_fs2.default.existsSync(privateKey)) {
      throw new Error("File \"" + privateKey + "\" not found.");
    } else {
      privateKey = _fs2.default.readFileSync(privateKey);
    }
  }

  return jwtGeneratorInstance.generate(privateKey, claims);
};

exports.default = Nexmo;
module.exports = exports["default"];