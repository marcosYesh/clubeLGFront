var baseUrl = 'http://localhost:25366';
var serverType = "LOCALHOST";

switch (serverType) {
    case "LOCALHOST":
        baseUrl = 'http://localhost:13273';
        break;
    case "DEV":
        baseUrl = 'https://youplaydev.mblabs.com.br';
        break;
    case "HOMOLOG":
        baseUrl = 'https://youplayhomolog.mblabs.com.br';
        break;
    case "PROD":
        baseUrl = 'https://youplay.mblabs.com.br';
        break;
}

$(function () {
    if (serverType != "LOCALHOST") {
        console.log('serverType');
        if (location.href.indexOf("https://") == -1) {
            location.href = location.href.replace("http://", "https://");
        }
    } else {
        console.log('serverType2');
    }
});

var SPMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},

spOptions = {
    onKeyPress: function (val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options);
    }
};

// show full image when user click on thumbnail
$('.viewPhotoPath').magnificPopup({ type: 'image' });

// modal pop to delete item on gridview
$('.confirmDialog').click(function () {
    var deleteUrl = $(this).attr('href');
    $('.btn-delete').attr('href', deleteUrl);
});

$('.confirmDialog').magnificPopup({
    removalDelay: 300,
    mainClass: 'mfp-fade',
    closeBtnInside: true,
    items: {
        src: '#popup',
        type: 'inline'
    }
});

function loadModalGeneric(title, content, btnClass, urlLink) {

    $('#popup-generic .btn-generic').attr('href', urlLink);
    $('#popup-generic .modal-title').text(title);
    $('#popup-generic .modalcontent').text(content);

    $.magnificPopup.open({
        removalDelay: 300,
        mainClass: 'mfp-fade',
        closeBtnInside: true,
        items: {
            src: '#popup-generic',
        },
        type: 'inline'
    });
}

function checkDate(date) {
    var abc = moment(date, 'DD/MM/YYYY').isValid();
    return abc;
}

function checkCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito 
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito 
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;
}

$('.phone').mask(SPMaskBehavior, spOptions);
$('.cep').mask('00000-000');
$('.dates').mask('00/00/0000');
$('.time').mask('00:00');
$('.date_time').mask('00/00/0000 00:00');
$('.time').mask('00:00');
$('.cpf').mask('000.000.000-00', { reverse: true });
$('.rg').mask('00.000.000-0', { reverse: true });
$('.cnpj').mask('00.000.000/0000-00', { reverse: true });
$('.money').mask("####9,99", { reverse: true });

$(".hasDatepicker").datepicker({
    dateFormat: "dd/mm/yyyy",
    autoclose: true
});

function searchResponsibleByCpf(cpf, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/GetResponsible?cpf=' + cpf,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}