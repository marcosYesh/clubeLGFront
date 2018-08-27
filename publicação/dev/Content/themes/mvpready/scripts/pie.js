
setDevicePie = function (android, ios) {
    var data, chartOptions

    android = android == 0 ? parseFloat(0.000000001) : android;
    ios = ios == 0 ? parseFloat(0.000001) : ios;

    data = [
        { label: "Android", data: android },
        { label: "iOS", data: ios }
    ]

    chartOptions = {
        series: {
            pie: {
                show: true,
                innerRadius: 0,
                stroke: {
                    width: 2
                }
            }
        },
        legend: {
            show: false,
            position: 'ne'
        },
        colors: mvpready_core.layoutColors
    }

    var holder = $('#pie-chart');

    if (holder.length) {
        $.plot(holder, data, chartOptions)
    }
};

setCampaignOnline = function (percentage) {
    console.log(percentage);
    var data, chartOptions

    data = [
        { label: "", data: parseInt(percentage) },
        { label: "", data: parseInt(100 - parseInt(percentage)) }
    ]

    chartOptions = {
        series: {
            pie: {
                show: true,
                innerRadius: .45,
                stroke: {
                    width: .3
                }
            }
        },
        colors: ['#d74b4b', '#C3C3C3']
    }

    var holder = $('.chart-campaign');

    if (holder.length) {
        $.plot(holder, data, chartOptions)
    }
};

setGraphDonuts = function (keyValueArray, htmlClass) {
    var data = [];
    var chartOptions;

    if (keyValueArray.length == 1) {
        keyValueArray[0].Value = keyValueArray[0].Value - 0.001;
        keyValueArray.push({ Key: 'OUTROS', Value: 0.001 })
    }

    var total = 0;
    $.each(keyValueArray, function (index, value) {
        total += value.Value;
    });

    $.each(keyValueArray, function (index, value) {
        var percentage = (value.Value / total) * 100;
        data.push({ label: value.Key + ' ' + '<b>' + percentage.toFixed(2) + '%' + '</b>', data: percentage });
    });

    chartOptions = {
        series: {
            pie: {
                show: true,
                innerRadius: .5,
                stroke: {
                    width: 0.5
                }
            }
        },
        legend: {
            position: 'ne'
        },
        tooltip: true,
        tooltipOpts: {
            content: '%s: %y'
        },
        grid: {
            hoverable: true
        },
        colors: ['#d74b4b', '#475F77', '#BCBCBC', '#777777', '#6685a4', '#E68E8E', '#FFFFFF']
    }

    var holder = $(htmlClass);

    if (holder.length) {
        $.plot(holder, data, chartOptions)
    }
};