$(document).ready(function () {

    var pageUrlbase = window.location.protocol + "//" + window.location.host;
    var polygonVertices = new Array();
    var mobileUserArray = new Array();
    var selectedAndroidMobileUserArray = new Array();
    var selectedIosMobileUserArray = new Array();
    var polygon = null;

    loadMaps = function () {
        var map = new GMaps({
            div: '#map_canvas',
            zoom: 14,
            lat: -23.523590004915874,
            lng: -46.639087200164795,
        });

        getSelectedMarkers = function () {
            $.each(mobileUserArray, function (index, value) {
                if (map.checkGeofence(value.Latitude, value.Longitude, polygon) == true) {
                    if (value.DeviceType == 1) {
                        selectedAndroidMobileUserArray.push(value);
                    }
                    else {
                        selectedIosMobileUserArray.push(value);
                    }
                }
            });

            var deviceIdAndroidList = $.map(selectedAndroidMobileUserArray, function (element) {
                return element.DeviceId;
            });

            var deviceIdIosList = $.map(selectedIosMobileUserArray, function (element) {
                return element.DeviceId;
            });

            var deviceIdList = $.merge(deviceIdAndroidList, deviceIdIosList);
            var deviceIdListSplit = deviceIdList.join(",");

            $('.selected-device-id').val(deviceIdListSplit);
            getNumberOfSelectedMobileUser();
        }

        getNumberOfSelectedMobileUser = function () {
            $('.selectedUsers').text(selectedAndroidMobileUserArray.length + selectedIosMobileUserArray.length + ' de usuários selecionados.');
        }

        clearPolygon = function () {
            if (polygon != null) {
                polygon.setMap(null);
            }
            polygon = null;
            map.removePolylines();
            map.removeMarkers();

            selectedAndroidMobileUserArray = new Array();
            selectedIosMobileUserArray = new Array();
            polygonVertices = new Array();


            $('.selectedUsers').text("");

            $.each(mobileUserArray, function (index, value) {
                addUserMobileMarker(value);
            });

            GMaps.geolocate({
                success: function (position) {
                    mobileUserArray.push(new Array(position.coords.latitude, position.coords.longitude));
                    addAccessMarker(position.coords.latitude, position.coords.longitude);
                },
                error: function (error) {
                    alert('A geolocalização falhou: ' + error.message);
                },
                not_supported: function () {
                    alert("Seu browser não suporta geolocalização, favor acessar o Chrome");
                },
                always: function () {
                }
            });
        }

        addPolygonMarker = function (latitude, longitude) {
            var icon = pageUrlbase + '/Content/gmaps/images/img_polygon_pin.png';
            var marker = {
                lat: latitude,
                lng: longitude,
                title: 'addPolygonMarker',
                icon: {
                    size: new google.maps.Size(16, 16),
                    url: icon
                },
                click: function (e) {

                    if (polygon == null) {
                        $('.selectedUsers').text("");
                        polygonVertices.push(new Array(e.position.k, e.position.D));
                        map.removePolylines();

                        polygon = map.drawPolygon({
                            paths: polygonVertices,
                            strokeColor: '#BBD8E9',
                            strokeOpacity: 1,
                            strokeWeight: 3,
                            fillColor: '#BBD8E9',
                            fillOpacity: 0.6
                        });

                        getSelectedMarkers();
                    }
                    else {
                        alert('Para nova busca, favor limpar seleção');
                    }
                },
                draggable: false
            }

            map.addMarker(marker);

            return marker;
        }

        addAccessMarker = function (latitude, longitude) {
            var icon = pageUrlbase + '/Content/gmaps/images/img_my_location_pin.png';
            var marker = {
                lat: latitude,
                lng: longitude,
                title: 'Você esta aqui',
                icon: {
                    size: new google.maps.Size(24, 24),
                    url: icon
                },
                click: function (e) {
                },
                infoWindow: {
                    content: '<p>Você esta aqui</p> <p>Favor selecionar uma área para o envio da mensagem</p>'
                },
                draggable: true
            }

            map.addMarker(marker);

            return marker;
        }

        addUserMobileMarker = function (userMobile) {
            var marker = null;
            var icon = (userMobile.DeviceType == 1) ? pageUrlbase + '/Content/gmaps/images/img_android_location_pin.png' : '/Content/gmaps/images/img_ios_location_pin.png';

            if (userMobile.Latitude != null) {
                var marker = {
                    lat: userMobile.Latitude,
                    lng: userMobile.Longitude,
                    title: userMobile.FirstName + ' ' + userMobile.LastName + ' (' + userMobile.StoreName + ')',
                    icon: {
                        size: new google.maps.Size(16, 16),
                        url: icon
                    },
                    click: function (e) {
                    },
                    infoWindow: {
                        content: '<p>Nome: ' + userMobile.Username + '</p> <p> Localização: ' + userMobile.Latitude + ',' + userMobile.Longitude + ' </p>'
                    }
                }
                map.addMarker(marker);
            }

            return marker;
        }

        GMaps.geolocate({
            success: function (position) {
                map.setCenter(position.coords.latitude, position.coords.longitude);
                addAccessMarker(position.coords.latitude, position.coords.longitude);
            },
            error: function (error) {
                alert('A geolocalização falhou: ' + error.message);
            },
            not_supported: function () {
                alert("Seu browser não suporta geolocalização, favor acessar o Chrome");
            },
            always: function () {
            }
        });

        function loadResults(data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var latLong = addUserMobileMarker(data[i])
                    if (latLong != null) {
                        mobileUserArray.push(data[i]);
                    }
                }
            }
        }

        $.ajax({
            url: window.location.protocol + "//" + window.location.host + '/api/usermobile/all',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadResults(data.ReturnData);
            }
        });

        $('.clearPolygon').click(function () {
            clearPolygon();
            $('.selected-device-id').val('');
        });
    }
});