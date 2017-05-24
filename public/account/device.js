
export function buildDevicesHTML (devices) {
    let devicesMarkup;
    devices.forEach(function(device, index) {
        devicesMarkup += injectDeviceInfo(device, index);
    });
    return devicesMarkup
}
export function injectDeviceInfo (device, index) {

    
 let deviceMarkup = "<div class='row device'>" +
                        "<div class='col col-sm-6 col-md-6 col-xs-6'>" +
                            `<p class='text-left'><span class='deviceNameJS'>${index + 1}. Device name: ${device.deviceName}</span></p>` +
                        "</div>" +
                        "<div class='col col-sm-6 col-md-6 col-xs-6'>" +
                            "<button class='btn btn-default btn-danger deleteDeviceJS' type='submit'>Delete Device</button>" +
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
                    "<div class='row deviceTokenRow'>" +
                        "<div class=' col col-sm-12 col-md-12 col-xs-12'>" +
                            "<div>" +
                                `<p class='tokenLine text-left'>Token: <span class='deviceTokenJS'>${device.deviceToken}</span></p>` +
                            "</div" +
                        "</div>" +
                    "</div>";
    return deviceMarkup
}

