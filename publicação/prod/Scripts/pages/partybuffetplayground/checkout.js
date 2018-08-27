/***************************** CHECKOUT *****************************/

// GET
function openCheckoutModal(playgroundId) {
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
    
    getByPlaygroundIdByCPF(playgroundId, function (data) {

        // fill all checkout inputs
        fillCheckoutModal(playgroundId, data);

        // define store price from user (father)

        $.unblockUI();

        $.magnificPopup.open({
            removalDelay: 300,
            mainClass: 'mfp-fade',
            closeBtnInside: true,
            items: {
                src: '#popup-checkoutticket',
            },
            type: 'inline'
        });
    });
}

// POST
function btnCheckout() {

    updateCheckoutEvent();

    var multipleExtraChildren = [];
    $(".change-cost:checked").each(function (index, value) {
        multipleExtraChildren.push(parseInt($(this).attr("data-play-id")));
    });

    var dataInput = {
        'Id': $("#Id2").val(),
        'DtEntraceEnd': moment().format('DD/MM/YYYY') + ' ' + $("#DtEntraceEnd2").val(),
        'PaymentType': $("#PaymentType2").val(),
        'PaidCost': $("#PaidCost2").val(),

        'PaymentTypeSplit': $("#PaymentType3").val(),
        'PaidCostSplit': $("#PaidCost3").val(),

        'Justification': $("#Justification2").val(),
        'WasEdited': $('#ChangeValues2').is(":checked") ? true : false,
        'Password': $('#UserPassword2').val(),
        'UserId': loggedUserId,
        'StoreId': selectedStoreId,
        "OtherChildrenIdList": multipleExtraChildren,
        "BuyAndUseGiftcard": $("#BuyGiftCard3").val(),

        "GiftCardResponsibleId": $("#WalletYouplay1").val(),
        "GiftCardResponsibleId2": $("#WalletYouplay2").val(),
        "StorePriceLabel": $("#StorePriceCheckout option:selected").val()
    }

    if (dataInput.DtEntraceEnd != '') {
        if (dataInput.PaymentType != '') {
            if (dataInput.PaidCost != '') {
                if (!dataInput.WasEdited || (dataInput.WasEdited && dataInput.Justification != '' && dataInput.Password != '')) {
                    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });
                    srvCheckOut(dataInput, function (child) {
                        $.unblockUI();
                        loadAll();

                        srvTicketCheckout(
                        {
                            "ResponsibleCPF": $('#UserMobileCPF2').val(),
                            "ChildName": $('#ChildName2').val(),
                            "DtStart": moment().format('DD/MM/YYYY') + ' ' + $('#DtEntraceBegin2').val(),
                            "DtEnd": dataInput.DtEntraceEnd,
                            "DtDuration": $('#DtDiff').val(),
                            "PlanType": convertPlanTypeFull(parseInt($("#UserSubscriptionsCheckout option:selected").attr('plantype'))),
                            "DOW": $('.row-stat .dow').text(),
                            "Cost": $('#PaidCost2').val(),
                            "PaymentType": $("#PaymentType2 option:selected").text()
                        }
                        , null);
                    });
                } else {
                    $.notify("Campo 'Justificativa' e 'Senha' são obrigatório quando os valores estão sendo editados", "error");
                }
            } else {
                $.notify("Campo 'Valor Cobrado' é obrigatório", "error");
            }
        } else {
            $.notify("Campo 'Forma de Pagamento' é obrigatório", "error");
        }
    } else {
        $.notify("Campo 'Horário de Saída' é obrigatório", "error");
    }
}

function fillCheckoutModal(playgroundId, data) {
    clearChildrenAtCheckout();
    if (data.OtherChildren != null && data.OtherChildren.length > 0) {
        $.each(data.OtherChildren, function (index, value) {
            insertChildrenAtCheckout(value.Id, value.EstimatedCost, value.DiffDates, value.ChildName + ' | ' + moment(value.DtEntraceBegin, 'DD-MM-YYYY HH:mm').format('HH:mm') + ' - ' + (data.DtEntraceEnd == null ? moment(new Date()).format("HH:mm") : (moment(data.DtEntraceEnd, 'DD-MM-YYYY HH:mm').format('HH:mm'))) + ' | ' + ((value.PlanTypeDesc == null || value.PlanTypeDesc == '') ? 'Sem plano' : value.PlanTypeDesc) + ' | ' + value.DiffDates + ' minuto(s) | R$ ' + value.EstimatedCostFormat);
        });
    }

    cleanSplitValues();

    $('#PaymentTypeSplit').val('1');
    $('#Id2').val(playgroundId);
    $('#DtEntraceBegin2').val(moment(data.DtEntraceBegin, 'DD-MM-YYYY HH:mm').format('HH:mm'));
    $('#EstimatedCost2').val('R$ ' + data.EstimatedCostFormat);
    $('#PlanType2').val(convertPlanTypeFull(data.PlanType));
    $('#PaidCost2').val(data.EstimatedCostFormat.replace(/[. ,](\d\d\d\D|\d\d\d$)/g, '$1'));
    $('#UserMobileCPF2').val(data.UserMobileCPF);
    $('#CPFSecondary2').val(data.SecondaryResponsibleCPF);
    $('#CPFSecondaryName2').val(data.SecondaryResponsibleCPFName);
    $('#ChildName2').val(data.ChildName);
    $('#ChildBirthday2').val(moment(data.ChildBirthday).format('DD/MM/YYYY'));
    $('#DtEntraceEnd2').val(moment().format('HH:mm'));
    $('#DtDiff').val(calculateDiff(data.DtEntraceBegin, data.DtEntraceEnd));
    $('#ChangeValues2').attr('checked', false);
    $('.div-justification').css('display', 'none');
    $('#DtEntraceEnd2').attr('disabled', 'disabled');
    $('#DtEntraceEnd2').val(data.DtEntraceEnd == null ? moment(new Date()).format("HH:mm") : (moment(data.DtEntraceEnd, 'DD-MM-YYYY HH:mm').format('HH:mm')));
    $('#PaidCost2').attr('disabled', 'disabled');
    $('#Justification2').attr('disabled', 'disabled');
    $("#Justification2").val('');
    $('#UserPassword2').attr('disabled', 'disabled');
    $('#UserPassword2').val('');
    $('#UserSubscriptionsCheckout').attr('disabled', 'disabled');
    $('#SpnStopedTime').text(data.TotalStopedtime + ' minuto(s)');
    $('#SpnStopedTime').attr('title', data.PlaygroundPlaypauseListDesc);
    $('#YouplayWallet').text('R$ ' + data.WalletSum.toFixed(2).replace('.', ','));
    $('#YouplayWallet').attr('title', data.WalletListDesc);
    $('#PaymentType2').val($('#PaymentType2 option:first').val());
    $("#BuyGiftCard3").val('0');
    if (data.WalletSum > 0) {
        $('#PaymentType2').val('9');
        $('.WalletYouplay1').css('display', 'block');
    } else {
        $('#PaymentType2').val('1');
        $('.WalletYouplay1').css('display', 'none');
    }
    $('.WalletYouplay2').css('display', 'none');

    $("#PaymentType3").val('0');
    $("#PaidCost3").val(''),
    $("#PaidCost3").attr('disabled', 'disabled');

    $('#PicResultCheckout3').attr('src', data.Responsible.PhotoPath != null ? data.Responsible.PhotoPath : '');
    $('#BuyGiftCard2').attr('href', baseUrl + '/cartaobonus?cpf=' + data.UserMobileCPF);

    $('#UserSubscriptionsCheckout').empty();
    searchChildrenByResponsibleCpf(data.UserMobileCPF, function (subscriptions) {
        if (subscriptions != null && subscriptions.length > 0) {
            $('#UserSubscriptionsCheckout').append('<option>-- Plano encontrado --</option>');
            $.each(subscriptions, function (index, value) {
                if (data.UserSubscriptionId == value.Id) {
                    $('#UserSubscriptionsCheckout').append('<option selected="selected" plantype="' + data.PlanType + '" value="' + value.Id + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                } else {
                    $('#UserSubscriptionsCheckout').append('<option value="' + value.Id + '" plantype="' + data.PlanType + '" name="' + value.ChildName + '" birthday="' + moment(value.ChildBirthday, 'DD-MM-YYYY').format('DD/MM/YYYY') + '" gendertype="' + value.ChildGenderType + '">' + value.FullDescription + '</option>');
                }
            });
        } else {
            $('#UserSubscriptionsCheckout').append('<option>-- Nenhum plano encontrado --</option>');

        }
    });

    // load my wallet and sub-responsible wallet
    $('.ddl-wallet-list').empty();
    if (data.GiftcardCheckoutDDL != null && data.GiftcardCheckoutDDL.length > 0) {
        $.each(data.GiftcardCheckoutDDL, function (index, value) {
            $('.ddl-wallet-list').append('<option value="' + value.Id + '">' + value.Text + '</option>');
        });
    }

    $('#StorePriceCheckout').val(data.StorePriceLabel);
}

function insertChildrenAtCheckout(playId, playCost, playMinutes, formmatedText) {
    $('.row-children-list').append('<div class="form-group col-sm-12">' +
                                    '<input data-play-id=' + playId + ' data-play-cost=' + playCost + ' data-play-time=' + playMinutes + ' type="checkbox" class="change-cost" style="width: 15px; height: 15px; vertical-align: text-bottom; margin-right: 5px;" />' +
                                    '<label>' + formmatedText + '</label>' +
                                '</div>');

    $('.change-cost').on('change', function () {
        var currentCost = parseFloat($('#EstimatedCost2').val().replace('R$ ', '').replace(',', '.').replace(/[. ,](\d\d\d\D|\d\d\d$)/g, '$1'));
        var sum = 0.0;
        $(".change-cost:checked").each(function (index, value) {
            sum += parseFloat($(this).attr("data-play-cost"));
        });
        $('#PaidCost2').val((sum + currentCost).toFixed(2).replace('.', ','));
    });
}

function updateCheckoutEvent() {

    $('#ChangeValues2').click(function () {

        if ($('#ChangeValues2').is(":checked")) {
            $('.div-justification').css('display', 'block');
            $('#PaidCost2').removeAttr('disabled');
            $('#Justification2').removeAttr('disabled');
            $('#UserPassword2').removeAttr('disabled');

            $('#UserSubscriptionsCheckout').removeAttr('disabled');
        } else {
            $('.div-justification').css('display', 'none');
            $('#PaidCost2').attr('disabled', 'disabled');
            $('#Justification2').attr('disabled', 'disabled');
            $('#UserPassword2').attr('disabled', 'disabled');

            $('#UserSubscriptionsCheckout').attr('disabled', 'disabled');

            getByPlaygroundId($('#Id2').val(), function (data) {
                $('#PaidCost2').val(data.EstimatedCostFormat);
            });
        }
    });
}

$('#PaidCost2, #PaidCost3').keyup(function () {
    var firstValue = $('#PaidCost3').val();
    var secondValue = $('#PaidCost2').val();

    if (!(firstValue != null && firstValue != '')) {
        firstValue = '0';
    }
    
    if (!(secondValue != null && secondValue != '')) {
        secondValue = '0';
    }
     
    firstValue = parseFloat(firstValue.replace(',', '.'));
    secondValue = parseFloat(secondValue.replace(',', '.'));
    var final = firstValue + secondValue;
    $('#SpnSplitCost').text('R$ ' + final.toFixed(2).replace('.',','));
});

function clearChildrenAtCheckout() {
    $('.row-children-list').empty();
}

$('#StorePriceCheckout').change(function () {
    
    $.blockUI({ message: $('.div-loader'), css: { width: '195px', height: '160px', top: '35%', left: '43%' }, baseZ: 1000000 });

    var playgroundId = $('#Id2').val();
    var storeLabel = $('#StorePriceCheckout option:selected').val();

    srvUpdateUserStorePriceLabel(playgroundId, storeLabel, function (data) {
        getByPlaygroundIdByCPF(playgroundId, function (data) {
            fillCheckoutModal(playgroundId, data);
            $.unblockUI();
        });
    });
});

$('#PaymentTypeSplit').change(function () {
    $('#SpnSplitCost').text('');
    if ($('#PaymentTypeSplit option:selected').val() == '2') {
        openSplitValues();
    } else {
        cleanSplitValues();
    }
});

function openSplitValues() {
    $('#PaymentType3').val('0');
    $('#PaidCost3').val('');
    $('#PaidCost3').removeAttr('disabled');
    $('#PaidCost2').removeAttr('disabled');
    $('.div-split-form').css('display', 'block');
}

function cleanSplitValues() {
    $('#PaymentType3').val('0');
    $('#PaidCost3').val('');
    $('#PaidCost2').attr('disabled', 'disabled');
    $('#PaidCost3').removeAttr('disabled');
    $('.div-split-form').css('display', 'none');
    $('#PaidCost2').val($('#EstimatedCost2').val().replace('R$ ', ''));
}

function srvCheckOut(dataInput, callback) {
    dataInput.PaidCost = dataInput.PaidCost.replace(",", ".");
    dataInput.PaidCostSplit = dataInput.PaidCostSplit.replace(",", ".");
    $.ajax({
        url: baseUrl + '/api/partybuffetplayground/checkout',
        type: 'POST',
        dataType: 'json',
        data: dataInput,
        success: function (data) {
            if (data.ResultStatus == "SUCCESS") {
                $.notify("Saída realizada com sucesso", "success");
                $.magnificPopup.close();
            } else {
                $.notify(data.ResultStatusMessage, "error");
            }

            callback(data.ReturnData);
        }
    });
}

function srvCalculateCost(id, userSubscriptionId, callback) {
    $.ajax({
        url: baseUrl + '/api/partybuffetplayground/calculateCost?id=' + id + '&userSubscriptionId=' + userSubscriptionId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}

function srvUpdateUserStorePriceLabel(id, label, callback) {
    $.ajax({
        url: baseUrl + '/api/partybuffetplayground/updateUserStorePriceLabel',
        type: 'POST',
        dataType: 'json',
        data: {
            'playgroundId': id,
            'label': label
        },
        success: function (data) {
            callback(data.ReturnData);
        }
    });
}