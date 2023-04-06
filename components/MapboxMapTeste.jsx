import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapboxMapTeste = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [center, setCenter] = useState([-49.25, -16.68]); // coordenadas iniciais do mapa -49.24, -16.68
  const [radius, setRadius] = useState(100); // raio inicial do círculo
  const [coords, setCoords] = useState([-49.24000554783504, -16.676079365182005])

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 14,
    });

    // add click listener to map TESTAR ISSO NO CELULAR
    map.current.on("click", (event) => {      
      if(map.current.getLayer("circle")) {
        map.current.removeLayer("circle")
        map.current.removeSource("circle")
      }
      
      const lngLat = event.lngLat;
      setCenter([lngLat.lng, lngLat.lat]);
      setRadius(100);

      console.log("lat:" + lngLat.lat + " - lng:" + lngLat.lng)

      // create geofencing circle
      const circle = turf.circle([lngLat.lng, lngLat.lat], radius, {
        steps: 64,
        units: "meters",
      });
      const geofence = {
        type: "FeatureCollection",
        features: [circle],
      };

      map.current.addSource("circle", {
        type: "geojson",
        data: geofence,
      });

      map.current.addLayer({
        id: "circle",
        type: "fill",
        source: "circle",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.5,
        },
      });
    });

  }, []);

  return <div ref={mapContainer} style={{ height: '90vh', width: '100vw'}} className="map-container" />;
};

export default MapboxMapTeste;
