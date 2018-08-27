/***************************** PAUSE *****************************/
function stopTime(id) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    stopCheckoutTime(id, function () {
        loadAll();
        $.unblockUI();
    });
}

function cancelStopTime(id) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    cancelStopCheckoutTime(id, function () {
        loadAll();
        $.unblockUI();
    });
}

function stopCheckoutTime(id, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/stoptime',
        type: 'POST',
        dataType: 'json',
        data: {
            'PlaygroundId': id,
            'UserId': loggedUserId
        },
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}

function cancelStopCheckoutTime(id, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/cancelStoptime',
        type: 'POST',
        dataType: 'json',
        data: {
            'PlaygroundId': id,
            'UserId': loggedUserId
        },
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}