/***************************** WEBCAM *****************************/
function take_snapshot() {
    Webcam.snap(function (data_uri) {
        document.getElementById('PicResult2').innerHTML = '<img src="' + data_uri + '"/>';
    });
}

function printTicketCheckin(playgroundId) {
    getByPlaygroundId(playgroundId, function (data) {
        srvTicketCheckin(
        {
            "ResponsibleCPF": data.UserMobileCPF,
            "ChildName": data.ChildName,
            "DtStart": moment(data.DtEntraceBegin, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY HH:mm'),
            "PlanType": convertPlanTypeFull(data.PlanType),
            "DOW": $('.row-stat .dow').text()
        }, null);
    });
}

function printWristTicket(playgroundId) {
}