import React, {useRef, useEffect, useState} from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapboxMap = ({ center, radius }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(center.lng);
  const [lat, setLat] = useState(center.lat);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
    });

    // map.current.on("load", () => {
    //     map.current.addLayer({
    //       id: "circle",
    //       type: "circle",
    //       source: {
    //         type: "geojson",
    //         data: {
    //           type: "Feature",
    //           geometry: {
    //             type: "Point",
    //             coordinates: [lng, lat],
    //           },
    //         },
    //       },
    //       paint: {
    //         "circle-radius": radius,
    //         "circle-color": "rgba(255, 0, 0, 0.5)",
    //         "circle-stroke-color": "rgba(255, 0, 0, 1)",
    //         "circle-stroke-width": 2,
    //       },
    //     });
    // });

    // map.current.on('load', () => {
    //   map.current.addSource('circle', {
    //     type: 'geojson',
    //     data: circle
    //   });

    //   map.current.addLayer({
    //     id: 'circle-fill',
    //     type: 'fill',
    //     source: circle,
    //     paint: {
    //       'fill-color': 'blue',
    //       'fill-opacity': 0.3
    //     }
    //   });

    //   map.current.addLayer({
    //     id: 'circle-line',
    //     type: 'line',
    //     source: 'circle',
    //     paint: {
    //       'line-color': 'blue',
    //       'line-width': 2
    //     }
    //   })
    // });

    // create geofencing circle
    const circle = turf.circle([lng, lat], radius, {
      steps: 64,
      units: "meters",
    });
    const geofence = {
      type: "FeatureCollection",
      features: [circle],
    };

    // add circle layer to map
    map.current.on("load", () => {
      map.current.addSource("geofencing", {
        type: "geojson",
        data: geofence,
      });

      map.current.addLayer({
        id: "geofencing-circle",
        type: "fill",
        source: "geofencing",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.5,
        },
      });

      // scale circle size with zoom
      const scale = {
        property: "zoom",
        type: "exponential",
        stops: [
          [0, radius / 4],
          [22, radius * 4],
        ],
      };
      
      // map.current.setPaintProperty(
      //   "geofencing-circle",
      //   "fill-radius",
      //   scale
      // );
    })

    // map.current.on("click", (e) => {
    //   const features = map.current.queryRenderedFeatures(e.point);
    //   const point = turf.point([e.lngLat.lng, e.lngLat.lat]);
    //   const centerPoint = turf.point([lng, lat]);
    //   const distance = turf.distance(point, centerPoint, {units: "meters" });
    //   if (distance < radius ) {
    //     console.log("Dentro")
    //   }
    // });
  }, []);

  return <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} className="map-container" />;

};

export default MapboxMap;