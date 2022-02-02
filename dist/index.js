var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import * as EPToolkit from "./utils/EPToolkit";
import QR from 'qrcode-base64'

var RNUSBPrinter = NativeModules.RNUSBPrinter;
var RNBLEPrinter = NativeModules.RNBLEPrinter;
var RNNetPrinter = NativeModules.RNNetPrinter;
var textTo64Buffer = function (text, opts) {
    var defaultOptions = {
        beep: false,
        cut: false,
        tailingLine: false,
        encoding: "UTF8",
    };
    var options = __assign(__assign({}, defaultOptions), opts);
    var buffer = EPToolkit.exchange_text(text, options);
    return buffer.toString("base64");
};
var billTo64Buffer = function (text, opts) {
    var defaultOptions = {
        beep: true,
        cut: true,
        encoding: "UTF8",
        tailingLine: true,
    };
    var options = __assign(__assign({}, defaultOptions), opts);
    var buffer = EPToolkit.exchange_text(text, options);
    return buffer.toString("base64");
};
var textPreprocessingIOS = function (text) {
    var options = {
        beep: true,
        cut: true,
    };
    return {
        text: text
            .replace(/<\/?CB>/g, "")
            .replace(/<\/?CM>/g, "")
            .replace(/<\/?CD>/g, "")
            .replace(/<\/?C>/g, "")
            .replace(/<\/?D>/g, "")
            .replace(/<\/?B>/g, "")
            .replace(/<\/?M>/g, ""),
        opts: options,
    };
};
// const imageToBuffer = async (imagePath: string, threshold: number = 60) => {
//   const buffer = await EPToolkit.exchange_image(imagePath, threshold);
//   return buffer.toString("base64");
// };
export var USBPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (vendorId, productId) {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.connectPrinter(vendorId, productId, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNUSBPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        return RNUSBPrinter.printRawData(textTo64Buffer(text, opts), function (error) {
            return console.warn(error);
        });
    },
    printBill: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        return RNUSBPrinter.printRawData(billTo64Buffer(text, opts), function (error) {
            return console.warn(error);
        });
    },
};
export var BLEPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (inner_mac_address) {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.connectPrinter(inner_mac_address, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNBLEPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text, opts) {
        // RNBLEPrinter.printImageData('https://storage.cloudconvert.com/tasks/0547a5db-c5a6-4d5b-9061-473b9fbbb0f3/IMG_4657.png?AWSAccessKeyId=cloudconvert-production&Expires=1643435280&Signature=ysOt%2BxtQItLdmScNDi%2BT65oX%2Bjg%3D&response-content-disposition=inline%3B%20filename%3D%22IMG_4657.png%22&response-content-type=image%2Fpng', () => {
        //     console.log('asdfd')
        // })
        
        // RNBLEPrinter.printImageData('https://www.cbs17.com/wp-content/uploads/sites/29/2021/03/qrcode_www.cbs17.com-1.png?w=370', () => {
        //     console.log('asdfd')
        // })
        // RNBLEPrinter.printRawData(`G0AbMhthARtnb29nbGUKCgoKCg==`, function (error) {
        //     return console.warn(error);
        // });
        // var imgData = QR.drawImg("asdsa", {
        //     typeNumber: 4,
        //     errorCorrectLevel: 'M',
        //     size: 500
        //   })
        // RNBLEPrinter.printImageBase64(imgData.split(',')[1], function (error) {
        //     return console.warn(error);
        // });
        // let nn = textTo64Buffer("ggoooo", opts)
        // // return
        // RNBLEPrinter.printRawData(nn, function (error) {
        //     return console.warn(error);
        // });
        // return
        
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text);
            RNBLEPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            let nn = textTo64Buffer(text, opts)
            RNBLEPrinter.printRawData(nn, function (error) {
                return console.warn(error);
            });
        }
    },
    
    printBill: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text);
            RNBLEPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNBLEPrinter.printRawData(billTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
    printQR: function (text) {
         var imgData = QR.drawImg(text, {
            typeNumber: 4,
            errorCorrectLevel: 'M',
            size: 500
          })
        RNBLEPrinter.printImageBase64(imgData.split(',')[1], function (error) {
            return console.warn(error);
        });
    },
    printImgBase64: function (base64) {
        RNBLEPrinter.printImageBase64(base64.split(',')[1], function (error) {
            return console.warn(error);
        })
   },
   printImg: function (img) {
        RNBLEPrinter.printImageData(img, () => {
            console.log('asdfd')
        })
    },
};
export var NetPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (host, port) {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.connectPrinter(host, port, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNNetPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text);
            RNNetPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printRawData(textTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
    printBill: function (text, opts) {
        if (opts === void 0) { opts = {}; }
        if (Platform.OS === "ios") {
            var processedText = textPreprocessingIOS(text);
            RNNetPrinter.printRawData(processedText.text, processedText.opts, function (error) { return console.warn(error); });
        }
        else {
            RNNetPrinter.printRawData(billTo64Buffer(text, opts), function (error) {
                return console.warn(error);
            });
        }
    },
};
export var NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);
export var RN_THERMAL_RECEIPT_PRINTER_EVENTS;
(function (RN_THERMAL_RECEIPT_PRINTER_EVENTS) {
    RN_THERMAL_RECEIPT_PRINTER_EVENTS["EVENT_NET_PRINTER_SCANNED_SUCCESS"] = "scannerResolved";
    RN_THERMAL_RECEIPT_PRINTER_EVENTS["EVENT_NET_PRINTER_SCANNED_ERROR"] = "registerError";
})(RN_THERMAL_RECEIPT_PRINTER_EVENTS || (RN_THERMAL_RECEIPT_PRINTER_EVENTS = {}));
