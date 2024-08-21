document.addEventListener('DOMContentLoaded', () => {
    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/5c77728d-d65f-4d71-a808-e199236c3eb1/style.json?key=HHkquygEXSt0Pn6n3Pdo',
        center: [28.9784, 41.0082],
        zoom: 10
    });
    map.addControl(
      new maplibregl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          trackUserLocation: true
      })
  );
  
  map.addControl(new maplibregl.NavigationControl());
  
  fetch('/data.geojson')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(geojson => {
        map.on('load', () => {
          test();
        });
        async function test(){
          
          map.addSource('geojson-data', {
            'type': 'geojson',
            'data': geojson
          });
          const muzeImage = await map.loadImage('../public/img/muze.png' );
          const camiImage = await map.loadImage('../public/img/cami.png' );
          const sarayImage = await map.loadImage('../public/img/saray.png' );
          const parkImage = await map.loadImage('../public/img/parkk.png' );
          const hisarImage = await map.loadImage('../public/img/hisar.png' );
          const kiliseImage = await map.loadImage('../public/img/kilise.png' );
          const kuleImage = await map.loadImage('../public/img/kule.png' );
          const sarnicImage = await map.loadImage('../public/img/sarnic.png' );
          map.addImage('muze', muzeImage.data);
          map.addImage('cami', camiImage.data);
          map.addImage('saray', sarayImage.data);
          map.addImage('parkk', parkImage.data);
          map.addImage('hisar', hisarImage.data);
          map.addImage('kilise', kiliseImage.data);
          map.addImage('kule', kuleImage.data);
          map.addImage('sarnic', sarnicImage.data);
  
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
               // 'Sarnıç', 'sarnic',
                'Park', 'parkk',
                'Kule', 'kule',
                'Hisar', 'hisar',
                /* default */ 'muze' 
              ],
              'icon-size': 0.5
          }
  
          });
          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false
        });
  
        // Bilgi kutucukları
        map.on('mouseenter', 'geojson-layer', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
            const name = e.features[0].properties.name;
            const visit_days = e.features[0].properties.visit_days;
            const museum_card = e.features[0].properties.museum_card;//kullanıcı görmüyor
            const rating = e.features[0].properties.rating;
  
            popup.setLngLat(coordinates)
                .setHTML(`<b>${name}</b><br>${rating}</b><br>${visit_days}<br>${description}<br>${museum_card}`)
                .addTo(map);
        });
  
        map.on('mouseleave', 'geojson-layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
  
        // Filtreleme işlemi
        const filterSelect = document.getElementById('filter-select');
        filterSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            if (selectedType === '') {
                map.setFilter('geojson-layer', null);
            } else {
                map.setFilter('geojson-layer', ['==', ['get', 'type'], selectedType]);
            }
        });
        }
      })
  
      .catch(error => console.error('Error:', error));
  
  });
  
  
  
  
  
  
  