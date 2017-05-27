
export function buildDevicesHTML (devices) {
    let devicesMarkup="";
    devices.forEach(function(device, index) {
        let test = injectDeviceInfo(device, index);
        devicesMarkup += test;
    });
    return devicesMarkup
}
export function injectDeviceInfo (device, index) {

let deviceMarkup = "<div class='row device'>" +
                        "<div class='col col-sm-6 col-md-6 col-xs-6'>" +
                            `<p class='text-left'><span class='deviceNameJS'>${index + 1}. Device name: ${device.deviceName}</span></p>` +
                        "</div>" +
                        "<div class='col col-sm-6 col-md-6 col-xs-6'>" +
                            `<button class='btn btn-default btn-danger delete-button-js device-js${index + 1}' type='button'>Delete Device</button>` +
                            //If I want to be also to rename devices
                            /*"<div class='btn-group'>" +
                                "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                                    "Actions <span class='caret'></span>" +
                                "</button>" +
                                "<ul class='dropdown-menu'>" +
                                    "<li><a role='button' class='renameDeviceJS'>Rename Device</a></li>" +
                                    "<li role='separator' class='divider'></li>" + 
                                    "<li><a role='button' class='deleteDeviceJS'>Delete Device</a></li>" +
                                "</ul>" +
                            "</div>" + */
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class=' col col-sm-12 col-md-12 col-xs-12'>" +
                            "<div>" +
                                `<p class='device-row text-left'>Token: <span class='deviceTokenJS device-js${index + 1}'>${device.deviceToken}</span></p>` +
                            "</div" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class=' col col-sm-12 col-md-12 col-xs-12'>" +
                            "<div>" +
                                `<p class='device-row text-left'>Device ID: <span class='device-id-js device-js${index + 1}'>${device.deviceId}</span></p>` +
                            "</div" +
                        "</div>" +
                    "</div>"
    return deviceMarkup
}

