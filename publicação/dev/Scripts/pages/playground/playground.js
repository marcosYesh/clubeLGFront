/***************************** PLAYGROUND *****************************/
setInterval("loadAll()", 30000);
loadAll();

function capacityControl(childCount, babyCount, maxCapacity, maxCapacityBaby) {
    $('.activeNonPaid').text(childCount + babyCount);
    $('.maxCapacityRemaningLabel').text(maxCapacity - childCount);
    $('.maxCapacityRemaningBabyLabel').text(maxCapacityBaby - babyCount);

    if (selectedStore.MaxCapacity == childCount && selectedStore.MaxCapacityBaby == maxCapacityBaby) {
        $('.btn-checkin').attr('disabled', 'disabled');
    } else {
        $('.btn-checkin').removeAttr('disabled');
    }

    var dif = maxCapacity - childCount;
    if (dif == 0) {
        $('.stat-maxcapacity').addClass('red');
        $('.stat-maxcapacity').removeClass('yellow');
        $('.stat-maxcapacity').removeClass('green');
    } else if (dif <= 5) {
        $('.stat-maxcapacity').addClass('yellow');
        $('.stat-maxcapacity').removeClass('red');
        $('.stat-maxcapacity').removeClass('green');
    }
    else {
        $('.stat-maxcapacity').addClass('green');
        $('.stat-maxcapacity').removeClass('red');
        $('.stat-maxcapacity').removeClass('yellow');
    }

    var difBaby = maxCapacityBaby - babyCount;
    if (difBaby == 0) {
        $('.stat-maxcapacity-baby').addClass('red');
        $('.stat-maxcapacity-baby').removeClass('yellow');
        $('.stat-maxcapacity-baby').removeClass('green');
    } else if (difBaby <= 5) {
        $('.stat-maxcapacity-baby').addClass('yellow');
        $('.stat-maxcapacity-baby').removeClass('red');
        $('.stat-maxcapacity-baby').removeClass('green');
    }
    else {
        $('.stat-maxcapacity-baby').addClass('green');
        $('.stat-maxcapacity-baby').removeClass('red');
        $('.stat-maxcapacity-baby').removeClass('yellow');
    }

}

function btnPause(playgroundId) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    postPausetime(playgroundId, function (data) {
        loadAll();
        $.unblockUI();
    });
}

function btnPlay(playgroundId) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    postPlaytime(playgroundId, function (data) {
        loadAll();
        $.unblockUI();
    });
}

function getToday() {
    $.ajax({
        url: baseUrl + '/api/holiday/GetAllCurrent?storeId=' + selectedStoreId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.ReturnData != null) {
                $('.stat-dow').removeClass('green');
                $('.stat-dow').removeClass('red');
                $('.stat-dow').addClass('green');
                $('.stat-dow').attr('title', data.ReturnData.HolidayName);
                $('.row-stat .dow').text('FERIADO');
            } else {
                $('.stat-dow').attr('title', '');
                printDOW();
            }
        }
    });
}

function printDOW() {
    $('.stat-dow').removeClass('green');
    $('.stat-dow').removeClass('red');

    var dayNumber = moment().format('E');
    if (dayNumber == 1) { $('.row-stat .dow').text("DIA ÚTIL"); $('.stat-dow').addClass('green'); }
    if (dayNumber == 2) { $('.row-stat .dow').text("DIA ÚTIL"); $('.stat-dow').addClass('green'); }
    if (dayNumber == 3) { $('.row-stat .dow').text("DIA ÚTIL"); $('.stat-dow').addClass('green'); }
    if (dayNumber == 4) { $('.row-stat .dow').text("DIA ÚTIL"); $('.stat-dow').addClass('green'); }
    if (dayNumber == 5) { $('.row-stat .dow').text("DIA ÚTIL"); $('.stat-dow').addClass('green'); }
    if (dayNumber == 6) { $('.row-stat .dow').text("SÁBADO"); $('.stat-dow').addClass('green'); }
    if (dayNumber == 7) { $('.row-stat .dow').text("DOMINGO"); $('.stat-dow').addClass('green'); }
}

function printDate() {
    $('.currentDate').text(moment().format('DD/MM/YYYY'));
    $('.currentHour').text(moment().format('HH:mm'));
    getToday();
}

function calculateChild(dataArray) {

    var child = 0;
    var baby = 0;

    $.each(dataArray, function (index, value) {
        if (moment().diff(moment(value.ChildBirthday), 'years') <= 2) {
            baby++;
        } else {
            child++;
        }
    });

    return {
        'childCount': child,
        'babyCount': baby
    }
}

function loadAll() {
    getAllCurrent(selectedStoreId, function (dataArray) {
        $('.table-playgound-body').empty();
        $('.table-playgound-body').prepend('<tr class="grid-row"><td class="grid-cell" colspan="14" style="padding: 5px 0;"><a onclick="openCheckinModal()" style="text-decoration: none !important; color: #000; width: 100%; height: 45px; padding: 13px 0" class="btn btn-xs btn-primary btn-checkin"</a>ADICIONAR CRIANÇA<i class="fa fa-sign-in" style="margin-left:5px;"></i></td></tr>');
        $.each(dataArray, function (index, value) {
            insertRow(value, false);
        });

        childMaxCapacity = dataArray != null ? calculateChild(dataArray).childCount : 0;
        babyMaxCapacity = dataArray != null ? calculateChild(dataArray).babyCount : 0;

        capacityControl(childMaxCapacity, babyMaxCapacity, selectedStore.MaxCapacity, selectedStore.MaxCapacityBaby);
        printDate();
        updateCheckoutEvent();

        if (dataArray.length > 0) {
            $('.btnCloseCashier').attr('disabled', 'disabled');

        } else {
            $('.btnCloseCashier').removeAttr('disabled');
        }
    });
}

function getAllCurrent(storeId, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/getAllCurrent?storeId=' + storeId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function getByPlaygroundId(id, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/Get?id=' + id,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function getByPlaygroundIdByCPF(id, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/GetByCPF?id=' + id,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function postPausetime(playgroundId, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/pause',
        type: 'POST',
        dataType: 'json',
        data: {
            'PlaygroundId': playgroundId,
            'UserId': loggedUserId
        },
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function postPlaytime(playgroundId, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/start',
        type: 'POST',
        dataType: 'json',
        data: {
            'PlaygroundId': playgroundId,
            'UserId': loggedUserId
        },
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function convertPlanType(planType) {
    switch (planType) {
        case 0:
            return "";
        case 1:
            return 'M';
        case 2:
            return 'T';
        case 3:
            return 'N';
        case 4:
            return 'B';
    }
}

function convertPlanTypeFull(planType) {
    switch (planType) {
        case 0:
            return "";
        case 1:
            return 'Manhã';
        case 2:
            return 'Tarde';
        case 3:
            return 'Noite';
        case 4:
            return 'Black';
    }
}

function insertRow(data, first) {
    var rowColor = (data.Responsible != null && data.DtEntraceBegin != null ? 'tr-green' : 'tr-red');
    rowColor = data.DtEntraceBegin == null ? 'tr-blue' : rowColor;
    rowColor = data.DtEntraceEnd != null ? 'tr-yellow' : rowColor;

    var row = '<tr class="grid-row ' + rowColor + '">' +
                '<td class="grid-cell">' +
                    '<a style="margin-right: 3px;" class="btn btn-xs btn-primary btn-playground-action" title="Alterar responsável" onclick=openCheckinEditModal(\'' + data.Id + '\',true)><i class="fa fa-exchange"></i></a>' +
                    (data.Responsible == null ? ('<a class="btn btn-xs btn-primary btn-playground-action" onclick=openResponsibleModal(\'' + data.UserMobileCPF + '\',\'' + data.Id + '\')><i class="fa fa-user"></i></a>') : '') +
                '</td>' +
                '<td class="grid-cell">' + (data.PlanType > 0 ? convertPlanType(data.PlanType) : '') + '</td>' +
                '<td class="grid-cell">' + (data.DtEntraceBegin != null ? (moment(data.DtEntraceBegin, 'DD/MM/YYYY HH:mm').format('HH:mm')) : '<a style="text-decoration: none !important;" class="btn btn-xs btn-primary" onclick=startCheckin(\'' + data.Id + '\')><i class="fa fa-play"></i></a>') + '</td>' +
                '<td class="grid-cell">' + (data.DtEntraceBegin != null ? (calculateDiff(data.DtEntraceBegin, data.DtEntraceEnd)) : '') + '</td>' +
                '<td class="grid-cell" title="TARIFA: ' + (data.StorePriceLabel != null ? data.StorePriceLabel.toUpperCase() : data.StorePriceLabel) + '" style="cursor:pointer"> R$ ' + data.EstimatedCostFormat + '</td>' +
                '<td class="grid-cell"><a style="cursor: pointer;" onclick=openCheckinEditModal(\'' + data.Id + '\') title=\'Editar as informações de entrada\'>' + data.ChildName + '</td>' +
                '<td class="grid-cell">' + moment().diff(moment(data.ChildBirthday), 'years') + ' anos</td>' +
                '<td class="grid-cell">' + data.ChildGenderTypeDesc + '</td>' +
                (data.Responsible != null ?
                        //('<td class="grid-cell"><a style="cursor: pointer;" onclick=openResponsibleModal(\'' + data.UserMobileCPF + '\',\''+data.Id+'\')>' + (data.UserMobileCPF != null ? (data.Responsible.Cellphone1 + ' | ' + data.UserMobileCPF) : '') + '</a></td>') :
                        ('<td class="grid-cell"><a style="cursor: pointer;" onclick=openResponsibleModal(\'' + data.UserMobileCPF + '\',\'' + data.Id + '\')>' + (data.UserMobileCPF != null ? data.UserMobileCPF : '') + '</a></td>') :
                        ('<td class="grid-cell">' + (data.UserMobileCPF != null ? data.UserMobileCPF : '') + '</td>')) +
    
                (data.DtEntraceBegin == null ? '<td></td>' : (
                (data.DtEntraceEnd == null ?
                    (data.IsPaused == false ?
                        '<td class="grid-cell"><a class="btn btn-xs btn-primary btn-playground-action" title="Pausar o tempo" onclick="btnPause(' + data.Id + ')"><i class="fa fa-pause"></i></a></td>' :
                        '<td class="grid-cell"><a class="btn btn-xs btn-primary btn-playground-action" title="Soltar o tempo" onclick="btnPlay(' + data.Id + ')"><i class="fa fa-play"></i></a></td>') :
                        '<td class="grid-cell"></td>'
                ))) +

                (data.DtEntraceBegin == null ? '<td></td>' : (
                (data.IsPaused == false ?
                    ((data.DtEntraceEnd == null && data.Responsible != null) ?
                            ('<td class="grid-cell"><a class="btn btn-xs btn-primary btn-playground-action" title="Cogelar o tempo" onclick="stopTime(' + data.Id + ')"><i class="fa fa-stop"></i></a></td>') :
                            (data.DtEntraceEnd != null ? ('<td class="grid-cell">' + moment(data.DtEntraceEnd, 'DD/MM/YYYY HH:mm').format('HH:mm') + '  <a class="btn btn-xs btn-primary btn-playground-action" title="Descongelar o tempo" onclick="cancelStopTime(' + data.Id + ')"><i class="fa fa-play"></i></a></td>') : ('<td class="grid-cell"></td>'))) :
                    '<td class="grid-cell"></td>'))) +

                (data.DtEntraceBegin == null ? '<td></td>' : (
                '<td class="grid-cell">' +
                    '<a class="btn btn-xs btn-primary btn-playground-action" style=" margin-right: 3px;" title="Imprimir ticket de entrada" onclick="printTicketCheckin(' + data.Id + ')"><i class="fa fa-ticket"></i></a>' +
                    /*'<a class="btn btn-xs btn-default" style="text-decoration: none !important; color: #000;" title="Imprimir pulsera" onclick="printWristTicket(' + data.Id + ')"><i class="fa fa-print" style="color: #000 !important; padding: 2px;"></i></a>'*/'')) +

                (data.DtEntraceBegin == null ? '<td></td>' : (
                (data.Responsible != null && data.IsPaused == false && data.DtEntraceEnd != null ?
                    '<td class="grid-cell"><a class="btn btn-xs btn-primary btn-playground-action" title="Realizar checkout desta criança" onclick="openCheckoutModal(' + data.Id + ')"><i class="fa fa-dollar"></i></a></td>' :
                    '<td class="grid-cell"><a class="btn btn-xs btn-primary btn-playground-action" style="cursor: no-drop;" title="Para realizar o encerramento do ticket o responsável precisa estar atribuido" disabled="disabled" onclick="openCheckoutModal(' + data.Id + ')"><i class="fa fa-dollar"></i></a></td>')))
    '</td>' +
'</tr>';
    if (first) {
        $('.table-playgound-body tr').eq(0).after(row);
    } else {
        $('.table-playgound-body').append(row);
    }
    $('.btnCloseCashier').attr('disabled', 'disabled');

    var quantity = $('.table-playgound-body tr').length - 1;

    if (moment().diff(moment(data.ChildBirthday), 'years') <= 2) {
        capacityControl(childMaxCapacity, babyMaxCapacity + 1, selectedStore.MaxCapacity, selectedStore.MaxCapacityBaby);
    } else {
        capacityControl(childMaxCapacity + 1, babyMaxCapacity, selectedStore.MaxCapacity, selectedStore.MaxCapacityBaby);
    }
}

function calculateDiff(dtEntraceBegin, dtEntraceEnd) {
    if (dtEntraceEnd == null) {
        var startdate = moment(dtEntraceBegin, "DD-MM-YYYY HH:mm:ss");
        var enddate = moment();
        var duration = moment.duration(enddate.diff(startdate));
        return (duration.get("days") * 1440) + (duration.get("hours") * 60) + duration.get("minutes") + " min";
    } else {
        var startdate = moment(dtEntraceBegin, "DD-MM-YYYY HH:mm:ss");
        var enddate = moment(dtEntraceEnd, "DD-MM-YYYY HH:mm:ss");
        var duration = moment.duration(enddate.diff(startdate));
        return (duration.get("days") * 1440) + (duration.get("hours") * 60) + duration.get("minutes") + " min";
    }
}