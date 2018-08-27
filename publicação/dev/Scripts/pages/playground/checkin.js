/***************************** CHECKIN *****************************/

// GET
function openCheckinModal() {

    clearupCheckinModal();

    $.magnificPopup.open({
        removalDelay: 300,
        mainClass: 'mfp-fade',
        closeBtnInside: true,
        items: {
            src: '#popup-checkinticket',
        },
        type: 'inline',
        focus: '#CPF'
    });

    document.getElementById("CPF").focus();
}

// GET EDIT
function openCheckinEditModal(playId, isChange) {

    $('.btn-addchindren').css('visibility', 'hidden');
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });

    getByPlaygroundId(playId, function (returnData) {
        fillInputFields(playId, returnData, isChange);
    });
}

// POST
function btnCheckin() {

    var dataInputArray = [];

    $('.row-children').each(function (index, value) {
        dataInputArray.push({
            'DtEntraceBegin': moment().format('DD/MM/YYYY') + ' ' + $("#DtEntraceBegin").val(),
            'ChildName': $(value).find(".ChildName").val(),
            'ChildGenderType': $(value).find(".ChildGenderType option:selected").val(),
            'ChildBirthday': $(value).find(".ChildBirthday").val(),
            'UserSubscriptionId': $(".UserSubscriptions option:selected").val(),
            'CPF': $("#CPF").val(),
            'SecondaryResponsibleCPF': $("#CPFSecondary").val(),
            'SecondaryResponsibleCPFName': $("#CPFSecondaryName").val(),
            'UserId': loggedUserId,
            'StoreId': selectedStoreId,
            'PlaygroundId': $("#PlayId").val(),
            'Justification': $('#CPFChangeJustification').val(),
            'StorePriceLabel': $("#StorePrice option:selected").val()
        });
    });

    var isValid = true;
    var isCpf = $('.div-document-list input[type=radio]:checked').val() == "CPF" ? true : false;

    $.each(dataInputArray, function (i, item) {
        if (validateCheckin(isCpf, dataInputArray[i]) == false) {
            isValid = false;
        }
    });

    if (isValid) {
        $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });

        srvCheckIn(dataInputArray, function (child) {
            if (child != null) {
                var a = convertPlanTypeFull($("#UserSubscriptions option:selected").attr('plantype'));
                $.each(child, function (i, item) {
                    loadAll();
                });

                updateCheckoutEvent();
                printDate();
            }
            $.unblockUI();
        });
    }
};

// FILL ALL MODAL INPUT FIELDS
function fillInputFields(playId, returnData, isChange) {
    if (isChange != undefined && isChange == true) {
        // customize checkin modal
        $('.div-justification-change').css('display', 'block');
        $('.div-justification-change-none').css('display', 'none');
        $('.btn-checkin-post').text('Alterar');
        $('.btn-checkin-title').text('Formulário de alteração de responsável');
    } else {
        $('.div-justification-change').css('display', 'none');
        $('.div-justification-change-none').css('display', 'block');
        $('.btn-checkin-post').text('Entrar');
        $('.btn-checkin-title').text('Formulário de entrada');
    }

    $('#UserSubscriptions').empty();
    $('#ChildRegistered').empty();
    $('.txt-begindate').val(moment(new Date()).format("HH:mm"));
    $('.spn-cpfresponsible').text('');
    $('#PlayId').val(playId);
    $('#CPF').val(returnData.UserMobileCPF);
    $('#CPFSecondary').val(returnData.SecondaryResponsibleCPF);
    $('#CPFSecondaryName').val(returnData.SecondaryResponsibleCPFName);
    $('#CPFChangeJustification').val('');

    searchChildrenByResponsibleCpf(returnData.UserMobileCPF, function (subscriptions) {
        if (subscriptions != null && subscriptions.length > 0) {
            $('.UserSubscriptions').append('<option>-- Plano encontrado --</option>');
            $.each(subscriptions, function (index, value) {
                if (returnData.UserSubscriptionId == value.Id) {
                    $('.UserSubscriptions').append('<option selected="selected" value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                    $(firstChildren).find('.ChildName').attr('disabled', 'disabled');
                    $(firstChildren).find('.ChildGenderType').attr('disabled', 'disabled');
                    $(firstChildren).find('.ChildBirthday').attr('disabled', 'disabled');
                } else {
                    $('.UserSubscriptions').append('<option value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                }
            });
        } else {
            $('.UserSubscriptions').append('<option>-- Nenhum plano encontrado --</option>');
        }

        searchGetChild($('#CPF').val(), function (child) {
            if (child != null && child.length > 0) {
                $('#ChildRegistered').append('<option>-- Criança encontrada --</option>');
                $.each(child, function (index, value) {
                    if (returnData.ChildName == value.ChildName) {
                        $('#ChildRegistered').append('<option selected="selected" value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildDtBirthday).format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FormmatedPlaygroundChild + '</option>');
                    } else {
                        $('#ChildRegistered').append('<option value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildDtBirthday).format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FormmatedPlaygroundChild + '</option>');
                    }
                });
            } else {
                $('#ChildRegistered').append('<option>-- Criança não encontrada --</option>');
            }
        });

        $('.group-children .row-children:not(:first)').remove();
        var firstChildren = $('.group-children .row-children:first');
        $(firstChildren).find('.ChildName').val(returnData.ChildName);
        $(firstChildren).find('.ChildGenderType').val(returnData.ChildGenderType);
        $(firstChildren).find('.ChildBirthday').val(moment(returnData.ChildBirthday).format('DD/MM/YYYY'));

        $('#ChildRegistered').removeAttr('disabled');
        $(firstChildren).find('.ChildName').removeAttr('disabled');
        $(firstChildren).find('.ChildGenderType').removeAttr('disabled');
        $(firstChildren).find('.ChildBirthday').removeAttr('disabled');

        $.magnificPopup.open({
            removalDelay: 300,
            mainClass: 'mfp-fade',
            closeBtnInside: true,
            items: {
                src: '#popup-checkinticket',
            },
            type: 'inline',
            focus: '#CPF'
        });

        document.getElementById("CPF").focus();
        $.unblockUI();
    });
}

// BUTTON EVENT THAT FILL ALL ABOUT FATHER AND CHILDREN
function btnSearchByCpfChildren() {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    $('#UserSubscriptions').empty();
    $('#ChildRegistered').empty();
    $('#ChildRegistered').removeAttr('disabled');
    $("#ChildName").removeAttr('disabled');
    $("#ChildGenderType").removeAttr('disabled');
    $("#ChildBirthday").removeAttr('disabled');

    var isCpf = $('.div-document-list input[type=radio]:checked').val() == "CPF" ? true : false;

    if (!isCpf || checkCPF($('#CPF').val().replace('.', '').replace('-', ''))) {
        searchResponsibleByCpf($('#CPF').val(), function (responsible) {
            if (responsible != null) {
                $('.spn-cpfresponsible').text('Documento encontrado');
                $('.spn-cpfresponsible').addClass("spn-green");
                $('.spn-cpfresponsible').removeClass("spn-red");

                $('.spn-cpfwallet').css('display', 'block');
                $('.spn-cpfwallet').text('SALDO DISPONÍVEL (A + B): R$ ' + responsible.WalletSum.toFixed(2).replace('.', ','));
                $('.spn-cpfwallet').attr('title', responsible.WalletListDesc);

                searchGetChild($('#CPF').val(), function (child) {
                    if (child != null && child.length > 0) {
                        $('#ChildRegistered').append('<option>-- Criança encontrada --</option>');
                        $.each(child, function (index, value) {
                            $('#ChildRegistered').append('<option value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildDtBirthday).format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FormmatedPlaygroundChild + '</option>');
                        });
                    } else {
                        $('#ChildRegistered').append('<option>-- Criança não encontrada --</option>');
                    }
                });
            } else {
                $('.spn-cpfresponsible').text('Documento não encontrado');
                $('.spn-cpfresponsible').addClass("spn-red");
                $('.spn-cpfresponsible').removeClass("spn-green");
            }
        });

        searchChildrenByResponsibleCpf($('#CPF').val(), function (subscriptions) {
            if (subscriptions != null && subscriptions.length > 0) {
                $('#UserSubscriptions').append('<option>-- Plano encontrado --</option>');
                $.each(subscriptions, function (index, value) {
                    $('#UserSubscriptions').append('<option value="' + value.Id + '" plantype="' + value.PlanType + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                });
            } else {
                $('#UserSubscriptions').append('<option>-- Nenhum plano encontrado --</option>');

            }
            $.unblockUI();
        });
    } else {
        $.unblockUI();
        $.notify("Campo 'CPF' inválido", "error");
    }
}

function btnAddChildren() {
    $('.group-children').append('<div class="row row-children"><div class="form-group col-sm-4"><label>Nome da Criança (*)</label><input type="text" class="form-control txt-childname parsley-validated ChildName" /></div><div class="form-group col-sm-4"><label>Gênero (*)</label><select class="form-control ChildGenderType"><option value="1">Menino</option><option value="2">Menina</option></select></div><div class="form-group col-sm-3"><label>Nascimento (*)</label><input type="text" class="form-control ChildBirthday txt-childname parsley-validated dates hasDatepicker" data-date-format="dd/mm/yyyy" name="ChildBirthday" /></div><div class="form-group col-sm-1" style="position: relative;"><a style="position: absolute; top: 22px; left: 0;" class="btn btn-secondary" onclick="btnRemoveChildren(this)" title="Remover Criança"><i class="fa fa-remove"></i></a></div></div>');
    $('.dates').mask('00/00/0000');
    $(".hasDatepicker").datepicker({
        dateFormat: "dd/mm/yyyy",
        autoclose: true
    });
}

function btnRemoveChildren(event) {
    var childrenRowHtml = $(event).parent().parent().remove();
}

function clearupCheckinModal() {
    // customize checkin modal
    $('.div-justification-change').css('display', 'none');
    $('.div-justification-change-none').css('display', 'block');
    $('.btn-checkin-post').text('Entrar');
    $('.btn-checkin-title').text('Formulário de entrada');
    $('.btn-addchindren').css('visibility', 'visible');
    $('.div-justification-change').css('display', 'none');
    $('.txt-begindate').val(moment(new Date()).format("HH:mm"));
    $('.spn-cpfresponsible').text('');
    $('#CPF').val('');
    $('#CPFSecondary').val('');
    $('#CPFSecondaryName').val('');
    $('#UserSubscriptions').empty();
    $('#UserSubscriptions').append('<option>-- Nenhum plano encontrado --</option>');
    $('#ChildRegistered').empty();
    $('#ChildRegistered').append('<option>-- Nenhuma criança encontrada --</option>');
    $('#ChildRegistered').removeAttr('disabled');
    $('#PlayId').val('0');
    $('#DocumentoTypeCPF').attr('checked', 'checked');
    $('.spn-cpfwallet').css('display', 'none');
    $('.group-children .row-children:not(:first)').remove();

    var firstChildren = $('.group-children .row-children:first');
    $(firstChildren).find('.ChildName').val('');
    $(firstChildren).find('.ChildGenderType').val(1);
    $(firstChildren).find('.ChildBirthday').val('');

    $(firstChildren).find('.ChildName').removeAttr('disabled');
    $(firstChildren).find('.ChildGenderType').removeAttr('disabled');
    $(firstChildren).find('.ChildBirthday').removeAttr('disabled');
}

function srvCheckIn(dataInput, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/checkin',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        data: JSON.stringify(dataInput),
        success: function (data) {
            if (data.ResultStatus == "SUCCESS") {
                $.notify("Entrada realizada com sucesso", "success");
                $.magnificPopup.close();
            } else {
                $.notify(data.ResultStatusMessage, "error");
            }

            callback(data.ReturnData);
        }
    });
}

function startCheckin(playId) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    srvStartCheckin(playId, function () {

        getByPlaygroundId(playId, function (returnData) {
            srvTicketCheckin({
                "ResponsibleCPF": returnData.UserMobileCPF,
                "ChildName": returnData.ChildName,
                "DtStart": returnData.DtEntraceBegin,
                "PlanType": returnData.PlanTypeDesc,
                "DOW": $('.row-stat .dow').text()
            }, null);
        });

        loadAll();
        $.unblockUI();
    });
}

function srvStartCheckin(id, callback) {
    $.ajax({
        url: baseUrl + '/api/playground/startCheckin',
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

function srvTicketCheckin(dataInput, callback) {
    $.ajax({
        url: 'https://localhost:2424/api/ticket/Checkin',
        type: 'POST',
        dataType: 'json',
        data: dataInput,
        success: function (data) {
        }
    });
}

function srvTicketCheckout(dataInput, callback) {
    $.ajax({
        url: 'https://localhost:2424/api/ticket/Checkout',
        type: 'POST',
        dataType: 'json',
        data: dataInput,
        success: function (data) {
        }
    });
}

function validateCheckin(isCpf, dataInput) {
    if (dataInput.ChildName != '') {
        if (dataInput.DtEntraceBegin != '') {
            if (dataInput.CPF != '') {
                if (!isCpf || checkCPF(dataInput.CPF)) {
                    //if (dataInput.SecondaryResponsibleCPF == '' || dataInput.SecondaryResponsibleCPF == null || checkCPF(dataInput.SecondaryResponsibleCPF)) {
                    if (dataInput.ChildBirthday != '') {
                        if (checkDate(dataInput.ChildBirthday, 'DD/MM/YYYY')) {
                            var dateNow = moment();
                            if (dateNow.isAfter(moment(dataInput.ChildBirthday, 'DD/MM/YYYY'))) {
                                return true;
                            }
                            else {
                                $.notify("Campo 'Nascimento' deve ser menor que hoje", "error");
                            }
                        } else {
                            $.notify("Formato do campo 'Nascimento' invalido (Exemplo: 15/12/2010)", "error");
                        }
                    } else {
                        $.notify("Campo 'Nascimento' é obrigatório", "error");
                    }
                    /*} else {
                        $.notify("Campo 'Doc. Secondário' inválido", "error");
                    }*/
                } else {
                    $.notify("Campo 'Doc. do Responsável' inválido", "error");
                }
            } else {
                $.notify("Campo 'Doc. do Responsável' é obrigatório", "error");
            }
        } else {
            $.notify("Campo 'Horário de Entrada' é obrigatório", "error");
        }
    } else {
        $.notify("Campo 'Nome da Criança' é obrigatório", "error");
    }

    return false;
}

$('#UserSubscriptions').on('change', function () {
    var selectedSub = $('#UserSubscriptions option:selected');

    $('.group-children .row-children:not(:first)').remove();
    var firstChildren = $('.group-children .row-children:first');
    $(firstChildren).find('.ChildName').val(selectedSub.attr('name'));
    $(firstChildren).find('.ChildGenderType').val(selectedSub.attr('gendertype'));
    $(firstChildren).find('.ChildBirthday').val(selectedSub.attr('birthday'));

    if (selectedSub.val() != '-- Plano encontrado --') {
        $("#ChildRegistered").val($("#ChildRegistered option:first").val());
        $("#ChildRegistered").attr('disabled', 'disabled');
        $(".ChildName").attr('disabled', 'disabled');
        $(".ChildGenderType").attr('disabled', 'disabled');
        $(".ChildBirthday").attr('disabled', 'disabled');
    } else {
        $("#ChildRegistered").removeAttr('disabled');
        $(".ChildName").removeAttr('disabled');
        $(".ChildGenderType").removeAttr('disabled');
        $(".ChildBirthday").removeAttr('disabled');
    }
});

$('#ChildRegistered').on('change', function () {
    var selectedSub = $('#ChildRegistered option:selected');

    $(".ChildName").last().val(selectedSub.attr('name')),
    $(".ChildGenderType:last-child").last().val(selectedSub.attr('gendertype'));
    $(".ChildBirthday:last-child").last().val(selectedSub.attr('birthday'));
});

$('#UserSubscriptionsCheckout').on('change', function () {
    var selectedSub = $('#UserSubscriptionsCheckout option:selected');
    var selectedSubId = selectedSub.val() == "-- Plano encontrado --" ? 0 : selectedSub.val();
    srvCalculateCost($('#Id2').val(), selectedSubId, function (data) {
        $('#PaidCost2').val(data.toFixed(2).replace('.', ','));
    });
});

$('.div-document-list input[type=radio]').click(function () {
    console.log('change');
    if (this.value == 'CPF') {
        $('#CPF').mask('000.000.000-00', { reverse: true });
    } else if (this.value == 'RG') {
        $('#CPF').mask('00.000.000-0', { reverse: true });
    } else {
        $('#CPF').unmask();
    }
});