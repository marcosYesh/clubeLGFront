/***************************** RESPONSIBLE *****************************/

function clearResponsibleForm() {
    $('#FatherName').val('');
    $('#FatherEmail').val('');
    $('#FatherCel1').val('');
    $('#FatherCel2').val('');
    $('#WSResult2').text('');
    $('#PicResult2').empty();
    $('#PicResult3').attr('src', '');
    $('.btnRegisterResponsible').text('Atribuir responsável');
    $('.UserSubscriptions').empty();
}

function btnSearchByCpf() {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    clearResponsibleForm();
    searchResponsibleByCpf($('#FatherCPF').val(), function (responsible) {
        if (responsible != null) {
            $('#FatherCPF').val(responsible.CPF);
            $('#FatherName').val(responsible.Name);
            $('#FatherEmail').val(responsible.Email);
            $('#FatherCel1').val(responsible.Cellphone1);
            $('#FatherCel2').val(responsible.Cellphone2);
            $('#PicResult3').attr('src', responsible.PhotoPath);
            $('.btnRegisterResponsible').text('Atualizar');

            searchChildrenByResponsibleCpf($('#FatherCPF').val(), function (subscriptions) {
                if (subscriptions != null && subscriptions.length > 0) {
                    $('.UserSubscriptions').append('<option>-- Plano encontrado --</option>');
                    $.each(subscriptions, function (index, value) {
                        $('.UserSubscriptions').append('<option value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                    });
                } else {
                    $('.UserSubscriptions').append('<option>-- Nenhum plano encontrado --</option>');

                }
                $.unblockUI();
            });

        } else {
            $('#WSResult2').text('Documento não encontrado');
            $('.btnRegisterResponsible').text('Atribuir responsável');
        }
        $.unblockUI();
    });
}

function openResponsibleModal(cpf, id) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    clearResponsibleForm();
    $('#FatherCPF').val(cpf);
    $('#PlaygroundId').val(id);

    searchResponsibleByCpf(cpf, function (responsible) {
        if (responsible != null) {
            $('#FatherCPF').val(responsible.CPF);
            $('#FatherName').val(responsible.Name);
            $('#FatherEmail').val(responsible.Email);
            $('#FatherCel1').val(responsible.Cellphone1);
            $('#FatherCel2').val(responsible.Cellphone2);
            $('#PicResult3').attr('src', responsible.PhotoPath);
            $('.btnRegisterResponsible').text('Atualizar');
            $('#WSResult2').text('Documento encontrado');
            $('#WSResult2').addClass("spn-green");
            $('#WSResult2').removeClass("spn-red");

            searchChildrenByResponsibleCpf($('#FatherCPF').val(), function (subscriptions) {
                if (subscriptions != null && subscriptions.length > 0) {
                    $('.UserSubscriptions').append('<option>-- Plano encontrado --</option>');
                    $.each(subscriptions, function (index, value) {
                        $('.UserSubscriptions').append('<option value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                    });
                } else {
                    $('.UserSubscriptions').append('<option>-- Nenhum plano encontrado --</option>');

                }
                $.unblockUI();
            });
        } else {
            $('#WSResult2').text('Documento não encontrado');
            $('#WSResult2').removeClass("spn-green");
            $('#WSResult2').addClass("spn-red");
        }

        $.magnificPopup.open({
            removalDelay: 300,
            mainClass: 'mfp-fade',
            closeBtnInside: true,
            items: {
                src: '#popup-fatherform',
            },
            type: 'inline'
        });

        $.magnificPopup.instance.close = function () {
            Webcam.reset();
            $.magnificPopup.proto.close.call(this);
        };

        if (id > 0) {
            Webcam.attach('#MyCamera2');
        }

        $.unblockUI();
    });
}

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

function searchChildrenByResponsibleCpf(cpf, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/GetUserSubscription?cpf=' + cpf,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}

function searchGetChild(cpf, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/GetChild?cpf=' + cpf,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}

function btnRegisterClick() {
    var responsibleData = {
        'PlaygroundId': $('#PlaygroundId').val(),
        'CPF': $('#FatherCPF').val(),
        'Name': $('#FatherName').val(),
        'Email': $('#FatherEmail').val(),
        'Cellphone1': $('#FatherCel1').val(),
        'Cellphone2': $('#FatherCel2').val(),
        'UserId': loggedUserId,
        'StoreId': selectedStoreId,
        'PhotoUrl': $('#PicResult2 img').attr('src')
    }

    if (responsibleData.PlaygroundId != '') {
        if (responsibleData.CPF != '') {
            if (1 == 1 || checkCPF(responsibleData.CPF.replace('.', '').replace('-', ''))) {
                if (responsibleData.Email != '') {
                    if (responsibleData.Cellphone1 != '') {
                        $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
                        registerResponsible(responsibleData, function (data) {
                            if (data.ResultStatus == "SUCCESS") {
                                $.notify("Responsável associado com sucesso", "success");
                                $('#CPF').val('');
                                $('#Name').val('');
                                $('#Email').val('');
                                $('#Cellphone1').val('');
                                $('#Cellphone2').val('');
                                loadAll();
                                $.magnificPopup.close();
                            } else {
                                $.notify("Algum problema ocorreu, favor tentar novamente", "error");
                            }

                            $.unblockUI();
                        });
                    } else {
                        $.notify("Campo 'Celular 1' é obrigatório", "error");
                    }
                } else {
                    $.notify("Campo 'Email' é obrigatório", "error");
                }
            } else {
                $.notify("Campo 'Documento' inválido", "error");
            }
        } else {
            $.notify("Campo 'Documento' é obrigatório", "error");
        }
    } else {
        $.notify("Campo 'PlaygroudId' é obrigatório", "error");
    }
}

function registerResponsible(dataInput, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/RegisterResponsible',
        type: 'POST',
        dataType: 'json',
        data: dataInput,
        success: function (data) {
            callback(data);
        }
    });
}