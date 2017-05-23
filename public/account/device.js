
export function buildDevicesHTML (devices) {
    let devicesMarkup;
    devices.forEach(function(device) {
        devicesMarkup += injectDeviceInfo(device);
    });
    return devicesMarkup
}
export function injectDeviceInfo (device) {

    let deviceMarkup =
        "<div class='row'>" +
            "<div class='col col-sm-6 col-md-6 col-xs-6'>" +
                `<p class='text-left'><span class='deviceNameJS'>Device name: ${device.deviceName}</span></p>` +
            "</div>" +
            "<div class='col col-sm-6 col-md-6 col-xs-6'>" +
                "<div class='btn-group'>" +
                    "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                  "Actions <span class='caret'></span>" +
                "</button>" +
                    "<ul class='dropdown-menu'>" +
                        "<li><a role='button' class='renameDeviceJS'>Rename Device</a></li>" +
                        "<li role='separator' class='divider'></li>" +
                        "<li><a role='button' class='deleteDeviceJS'>Delete Device</a></li>" +
                    "</ul>" +
                "</div>" +
            "</div>" +
        "</div>" +
        "<div class='row deviceTokenRow'>" +
            "<div class=' col col-sm-12 col-md-12 col-xs-12'>" +
                "<div>" +
                    `<p class='tokenLine text-left'>Token: <span id='deviceTokenJS'>${device.deviceToken}</span></p>` +
                "</div" +
            "</div>" +
        "</div>";
    return deviceMarkup
}
