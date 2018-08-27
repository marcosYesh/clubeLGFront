/***************************** STORES *****************************/
// load all stores
getStores(function (data) {
    $('#StoreList, #StoreListModal').empty();
    updateDashboardLabels(data);
    loadAll();
});

function getStores(callback) {
    $.ajax({
        url: baseUrl + '/api/store/getStores',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function getStoreById(storeId, callback) {
    $.ajax({
        url: baseUrl + '/api/store/getStoresById?id=' + storeId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function getStorePrice(storeId, callback) {
    $.ajax({
        url: baseUrl + '/api/store/getStorePrice?storeId=' + storeId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function getStoreBabyCarriagePrice(storeId, callback) {
    $.ajax({
        url: baseUrl + '/api/storebabycarriage/getStorePrice?storeId=' + storeId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return callback(data.ReturnData);
        }
    });
}

function updateDashboardLabels(data) {
    $('#StoreList, #StoreListModal, #BuffetPartyListModal').empty();

    $.each(data, function (index, value) {
        $('#StoreList, #StoreListModal').append('<option value="' + value.Id + '">' + value.Name + '</option>');
        if (value.Id == selectedStoreId) {
            selectedStore = value;
        }
    });

    if (selectedStoreId == null) {
        selectedStoreId = data[0].Id;
        selectedStore = data[0]
        $('#StoreList').removeAttr('disabled', 'disabled');
    } else {
        $('#StoreList').val(selectedStoreId);
        $('#StoreList').attr('disabled', 'disabled');
    }

    $('#StoreName').text(selectedStore.Name);

    getStoreBabyCarriagePrice(selectedStoreId, function (data) {
        updateStorePriceDropdownList(data);
    });
}

function updateStorePriceDropdownList(data) {
    $('#StorePrice, #StorePriceCheckout').empty();
    $.each(data, function (index, value) {
        $('#StorePrice, #StorePriceCheckout').append('<option value="' + value + '">' + value + '</option>');
    });
}

$('.btn-changestore').click(function () {
    selectedStoreId = $('#StoreListModal option:selected').val();
    getStores(function (data) {
        var quantity = $('.table-playgound-body tr').length - 1;
        capacityControl(quantity, selectedStore.MaxCapacity);

        updateDashboardLabels(data);
        loadAll();

        getStoreBabyCarriagePrice(selectedStoreId, function (data) {
            updateStorePriceDropdownList(data);
        });

    });
    $.magnificPopup.close();
});

$('.dialogChangeStore').magnificPopup({
    removalDelay: 300,
    mainClass: 'mfp-fade',
    closeBtnInside: true,
    items: {
        src: '#popup-changestore',
        type: 'inline'
    }
});

$('.dialogChangePartyBuffet').magnificPopup({
    removalDelay: 300,
    mainClass: 'mfp-fade',
    closeBtnInside: true,
    items: {
        src: '#popup-changebuffetparty',
        type: 'inline'
    }
});