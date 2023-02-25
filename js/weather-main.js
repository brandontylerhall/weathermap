// collects data and displays current weather
$.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: weatherKey,
    lat: 32.4610,
    lon: -84.9877,
    units: "imperial"
}).done(function (data) {
    displayInfoCurrent(data);
});

// collects data and displays forecast for 5 days
$.get("http://api.openweathermap.org/data/2.5/forecast", {
    APPID: weatherKey,
    lat: 32.4610,
    lon: -84.9877,
    units: "imperial"
}).done(function (data) {
    data.list.forEach(displayInfoForecast);
});


// generates map centers on columbus
mapboxgl.accessToken = mapBoxKey;
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 9,
    center: [-84.9877, 32.4610],
});

// create origin marker on columbus, dragable
const marker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([-84.9877, 32.4610])
    .addTo(map);

// geolocate API
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

// zoom features from mapbox doc
map.addControl(new mapboxgl.NavigationControl());
map.addControl(geolocate);

// when dragend function for marker - displays updated info and centers on marker
function onDragEnd() {
    const lngLat = marker.getLngLat();
    $.get("http://api.openweathermap.org/data/2.5/weather", {
        APPID: weatherKey,
        lat: lngLat.lat,
        lon: lngLat.lng,
        units: "imperial"
    }).done(function (data) {
        let original = $('#forecast').html()
        if (original !== "") {
            $('#forecast').html("")
        }
        displayInfoCurrent(data);
        map.flyTo({
            center: [data.coord.lon, data.coord.lat],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 13
        });
    });
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: weatherKey,
        lat: lngLat.lat,
        lon: lngLat.lng,
        units: "imperial"
    }).done(function (data) {
        data.list.forEach(displayInfoForecast);
    });
}

marker.on('dragend', onDragEnd)

// creates new marker on mouseclick, updates current and forecasted weather at that location -- is draggable
map.on('click', (e) => {
    marker
        .setLngLat(e.lngLat)
    $.get("http://api.openweathermap.org/data/2.5/weather", {
        APPID: weatherKey,
        lat: e.lngLat.lat,
        lon: e.lngLat.lng,
        units: "imperial"
    }).done(function (data) {
        let original = $('#forecast').html()
        if (original !== "") {
            $('#forecast').html("")
        }
        displayInfoCurrent(data);
        map.flyTo({
            center: [data.coord.lon, data.coord.lat],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 13
        });
    });
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: weatherKey,
        lat: e.lngLat.lat,
        lon: e.lngLat.lng,
        units: "imperial"
    }).done(function (data) {
        data.list.forEach(displayInfoForecast);
    });

    function onDragEnd() {
        const lngLat = marker.getLngLat();
        $.get("http://api.openweathermap.org/data/2.5/weather", {
            APPID: weatherKey,
            lat: lngLat.lat,
            lon: lngLat.lng,
            units: "imperial"
        }).done(function (data) {
            let original = $('#forecast').html()
            if (original !== "") {
                $('#forecast').html("")
            }
            displayInfoCurrent(data);
            map.flyTo({
                center: [data.coord.lon, data.coord.lat],
                essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                zoom: 11
            });
        });
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            APPID: weatherKey,
            lat: lngLat.lat,
            lon: lngLat.lng,
            units: "imperial"
        }).done(function (data) {
            data.list.forEach(displayInfoForecast);
        });
    }

    marker.on('dragend', onDragEnd)
});

// searches for value entered, flies to location, updates current and forecasted info
$('.btn').click(function (e) {
    e.preventDefault();
    let searchFor = $('#search').val();
    $.get("http://api.openweathermap.org/data/2.5/weather", {
        APPID: weatherKey,
        q: searchFor,
        units: "imperial"
    }).done(function (data) {
        let original = $('#forecast').html()
        if (original !== "") {
            $('#forecast').html("")
        }
        displayInfoCurrent(data);
        map.flyTo({
            center: [data.coord.lon, data.coord.lat],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        marker.setLngLat(data.coord)

        function onDragEnd() {
            const lngLat = marker.getLngLat();
            $.get("http://api.openweathermap.org/data/2.5/weather", {
                APPID: weatherKey,
                lat: lngLat.lat,
                lon: lngLat.lng,
                units: "imperial"
            }).done(function (data) {
                let original = $('#forecast').html()
                if (original !== "") {
                    $('#forecast').html("")
                }
                displayInfoCurrent(data);
                map.flyTo({
                    center: [data.coord.lon, data.coord.lat],
                    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                    zoom: 11
                });
            });
            $.get("http://api.openweathermap.org/data/2.5/forecast", {
                APPID: weatherKey,
                lat: lngLat.lat,
                lon: lngLat.lng,
                units: "imperial"
            }).done(function (data) {
                data.list.forEach(displayInfoForecast);
            });
        }

        marker.on('dragend', onDragEnd)
    });
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: weatherKey,
        q: searchFor,
        units: "imperial"
    }).done(function (data) {
        data.list.forEach(displayInfoForecast);
    });
})

// function to generate info for current day
function displayInfoCurrent(data) {
    $('#current')
        .html('<div class="row d-flex space-between flex-wrap border border-dark my-3 mx-2">' +
                    '<div class="d-flex justify-content-center bg-secondary text-white flex-grow-1">' +
                        '<span>Current Weather</span>' +
                    '</div>' +
                    '<div class="d-flex flex-grow-1 justify-content-center"> Temperature: &nbsp;' +
                        '<span class="fw-bold">' + data.main.temp + '<sup>&deg;F</sup></span>' +
                    '</div>' +
                    '<div class="d-flex flex-grow-1 justify-content-center"> Weather Type: &nbsp;' +
                        '<span class="fw-bold">' + data.weather[0].main + '</span>' +
                    '</div>' +
                    '<div class="d-flex justify-content-center border-bottom">' +
                        '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png">' +
                    '</div>' +
                    '<div class="d-flex justify-content-center border-bottom">Humidity: &nbsp;' +
                        '<span class="fw-bold">' + data.main.humidity + '%</span>' +
                    '</div>' +
                    '<div class="d-flex justify-content-center border-bottom">Wind: &nbsp;' +
                        '<span class="fw-bold">' + data.wind.speed + 'mph</span>' +
                    '</div>' +
                    '<div class="d-flex justify-content-center"> Pressure: &nbsp;' +
                        '<span class="fw-bold">' + data.main.pressure + 'mb</span>' +
                    '</div>' +
                '</div>')
}

// function to generate info per day
function displayInfoForecast(data) {
    if (data.dt_txt.indexOf("15:00:00") !== -1) {
        let test = $('#forecast')
            .append('<div class="row d-flex space-between flex-wrap mb-3">' +
                        '<div class="d-flex justify-content-center bg-secondary flex-grow-1 border border-dark text-white">' + data.dt_txt + '</div>' +
                        '<div class="d-flex flex-grow-1 justify-content-center"> Temperature: &nbsp;' +
                            '<span class="fw-bold">' + data.main.temp + '<sup>&deg;F</sup></span>' +
                        '</div>' +
                        '<div class="d-flex flex-grow-1 justify-content-center"> Weather Type: &nbsp;' +
                            '<span class="fw-bold">' + data.weather[0].main + '</span>' +
                        '</div>' +
                        '<div class="d-flex justify-content-center border-bottom">' +
                            '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png">' +
                        '</div>' +
                        '<div class="d-flex justify-content-center border-bottom">Humidity: &nbsp;' +
                            '<span class="fw-bold">' + data.main.humidity + '%</span>' +
                        '</div>' +
                        '<div class="d-flex justify-content-center border-bottom">Wind: &nbsp;' +
                            '<span class="fw-bold">' + data.wind.speed + 'mph</span>' +
                        '</div>' +
                        '<div class="d-flex justify-content-center"> Pressure: &nbsp;' +
                            '<span class="fw-bold">' + data.main.pressure + 'mb</span>' +
                        '</div>' +
                    '</div>')
    }
}