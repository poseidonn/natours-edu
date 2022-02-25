/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYml0aWtwaWwiLCJhIjoiY2t6cTRjNWFxMHM2aDJycGVsZmZvdXJpbiJ9.Ycc6kwEu8XMc5hPGT9AJrg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bitikpil/ckzq4ttjb000i14qfz9z7hgbg',
    scrollZoom: false,
    /* center: [-118.113491, 34.111745],
  zoom: 4,
  interactive: false, */
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // add marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // add popup

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      bottom: 150,
      top: 200,
      left: 100,
      right: 100,
    },
  });
};
