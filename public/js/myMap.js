document.addEventListener('DOMContentLoaded', () => {
    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/5c77728d-d65f-4d71-a808-e199236c3eb1/style.json?key=HHkquygEXSt0Pn6n3Pdo',
        center: [28.9784, 41.0082],
        zoom: 10
    });
  
    map.addControl(new maplibregl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
  
    map.addControl(new maplibregl.NavigationControl());
  
    Promise.all([
        map.loadImage('../public/img/muze.png'),
        map.loadImage('../public/img/cami.png'),
        map.loadImage('../public/img/saray.png'),
        map.loadImage('../public/img/parkk.png'),
        map.loadImage('../public/img/hisar.png'),
        map.loadImage('../public/img/kilise.png'),
        map.loadImage('../public/img/kule.png'),
        map.loadImage('../public/img/sarnic.png'),
        map.loadImage('../public/img/star.png')  // Tıklanan yerler için yıldız ikonu
    ]).then(images => {
        const [muzeImage, camiImage, sarayImage, parkImage, hisarImage, kiliseImage, kuleImage, sarnicImage, visitedImage] = images;
  
        map.addImage('muze', muzeImage.data);
        map.addImage('cami', camiImage.data);
        map.addImage('saray', sarayImage.data);
        map.addImage('parkk', parkImage.data);
        map.addImage('hisar', hisarImage.data);
        map.addImage('kilise', kiliseImage.data);
        map.addImage('kule', kuleImage.data);
        map.addImage('sarnic', sarnicImage.data);
        map.addImage('visited', visitedImage.data);  // Tıklandıktan sonra tek ikon
  
        map.addSource('geojson-data', {
            'type': 'geojson',
            'data': '/data.geojson'
        });
  
        // Yerlerin katmanı
        map.addLayer({
            'id': 'geojson-layer',
            'type': 'symbol',
            'source': 'geojson-data',
            'layout': {
                'icon-image': [
                    'match',
                    ['get', 'type'],
                    'Müze', 'muze',
                    'Cami', 'cami',
                    'Saray', 'saray',
                    'Kilise', 'kilise',
                    'Park', 'parkk',
                    'Kule', 'kule',
                    'Hisar', 'hisar',
                    /* default */ 'muze'
                ],
                'icon-size': 0.5
            }
        });
  
        // Tıklanan yerlerin katmanı
        map.addSource('visited-data', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': []
            }
        });
  
        map.addLayer({
            'id': 'visited-layer',
            'type': 'symbol',
            'source': 'visited-data',
            'layout': {
                'icon-image': 'visited',
                'icon-size': 0.1
            }
        });
  
        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false
        });
  
        map.on('mouseenter', 'geojson-layer', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
            const name = e.features[0].properties.name;
            const visit_days = e.features[0].properties.visit_days;
            const museum_card = e.features[0].properties.museum_card;
            const rating = e.features[0].properties.rating;
  
            popup.setLngLat(coordinates)
            .setHTML(`<b>${name}</b><br>${rating}</b><br>${visit_days}<br>${description}<br>${museum_card}`)
                .addTo(map);
        });
  
        map.on('mouseleave', 'geojson-layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
  
        map.on('click', 'geojson-layer', (e) => {
            // Tıklanan yerleri 'visited' katmanına ekle
            const visitedData = map.getSource('visited-data');
            const features = visitedData._data.features;
            features.push(e.features[0]);
            visitedData.setData({
                'type': 'FeatureCollection',
                'features': features
            });
        });
  
        map.on('mouseenter', 'visited-layer', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
          const name = e.features[0].properties.name;
          const visit_days = e.features[0].properties.visit_days;
  
          popup.setLngLat(coordinates)
              .setHTML(`<b>${name}</b><br>${description}<br>${visit_days}`)
              .addTo(map);
      });
  
      map.on('mouseleave', 'visited-layer', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
      });
  
        // Yerleri filtreleme işlemi
        const filterSelect = document.getElementById('filter-select');
        filterSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            if (selectedType === '') {
                map.setFilter('geojson-layer', null);
            } else {
                map.setFilter('geojson-layer', ['==', ['get', 'type'], selectedType]);
            }
        });
    })
    .catch(error => console.error('Error:', error));
  });

  // Google Yer Kütüphanesi
  function initialize() {
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(37.971297,-122.523168)
		);

	var origin_input = document.getElementById('startAddress');
	var destination_input = document.getElementById('endAddress');
	var options = {
		bounds: defaultBounds,
	};
	var autocomplete_origin = new google.maps.places.Autocomplete(origin_input, options); 
	var autocomplete_destination = new google.maps.places.Autocomplete(destination_input, options); 
}
  google.maps.event.addDomListener(window, 'load', initialize);

// Şu anki tarihi alma
    var curDateTime = new Date();
    var curYear = curDateTime.getFullYear();
    var curMonth = curDateTime.getMonth() + 1;
    var curDay = curDateTime.getDate();
    var curDate = "";
    curDate = ((curMonth < 10) ? "0" : "") + curMonth + "/" + curDay + "/" + curYear;
    document.getElementById("date").value = curDate;

// Tarih ve saat seçilmesi (jQuery Hazır Fonksiyonu)
$(function () {
	$('#date').datepicker();
	$('input.timepicker').timepicker({
		timeFormat: 'h:mm p',
		interval: 30,
		minHour: 0,
		maxHour: 24,
		defaultTime: 'now',
		dropdown: true,
		dynamic: false,
	});
});




  
  