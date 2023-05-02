import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapboxMap = ({ id }) => {

  const idUser = useRef(id)
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userLocationDot = useRef(null);
  const [center, setCenter] = useState([-49.25, -16.68]); // coordenadas iniciais do mapa -49.24, -16.68
  const [radius, setRadius] = useState(100); // raio inicial do círculo
  const [start, setStart] = useState([-49.24000240042355, -16.676058946542966]);
  const [end, setend] = useState([-49.2467092280161, -16.677949457902557])

  idUser.current = id

  useEffect(() => {
    // calculate route between start and end points
    const line = turf.lineString([start, end]);
    const route = turf.lineChunk(line, 100, { units: "meters" }).features;

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 14,
    });

    map.current.on("load", (e) => {
      const savedLocation = JSON.parse(localStorage.getItem(`location-${idUser.current}`));
      if (savedLocation != null && savedLocation.id == idUser.current) {
        setCenter([savedLocation.lng, savedLocation.lat]);
        setRadius(100);
  
        // create geofencing circle
        const circle = turf.circle([savedLocation.lng, savedLocation.lat], radius, {
          steps: 64,
          units: "meters",
        });
        const geofence = {
          type: "FeatureCollection",
          features: [circle],
        };
  
        map.current.addSource(`circle-${savedLocation.id}`, {
          type: "geojson",
          data: geofence,
        });
  
        map.current.addLayer({
          id: `circle-${savedLocation.id}`,
          type: "fill",
          source: `circle-${savedLocation.id}`,
          paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.5,
          },
        });
      } else {

        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key) && key.startsWith('location')) {
            const savedLocation = JSON.parse(localStorage.getItem(key));

            // create geofencing circle
            const circle = turf.circle([savedLocation.lng, savedLocation.lat], radius, {
              steps: 64,
              units: "meters",
            });

            const geofence = {
              type: "FeatureCollection",
              features: [circle],
            };

            map.current.addSource(`circle-${savedLocation.id}`, {
              type: "geojson",
              data: geofence,
            });
      
            map.current.addLayer({
              id: `circle-${savedLocation.id}`,
              type: "fill",
              source: `circle-${savedLocation.id}`,
              paint: {
                "fill-color": "#ff0000",
                "fill-opacity": 0.5,
              },
            });
          }
        }        
      }
    });

    // add click listener to map
    map.current.on("click", (event) => {
      if (idUser.current != null ) {
        const layer = `circle-${idUser.current}`   
        if(map.current.getLayer(layer)) {
          map.current.removeLayer(layer)
          map.current.removeSource(layer)
        }
        
        const lngLat = event.lngLat;
        setCenter([lngLat.lng, lngLat.lat]);
        setRadius(100);

        // create geofencing circle
        const circle = turf.circle([lngLat.lng, lngLat.lat], radius, {
          steps: 64,
          units: "meters",
        });
        const geofence = {
          type: "FeatureCollection",
          features: [circle],
        };

        map.current.addSource(`circle-${idUser.current}`, {
          type: "geojson",
          data: geofence,
        });

        map.current.addLayer({
          id: `circle-${idUser.current}`,
          type: "fill",
          source: `circle-${idUser.current}`,
          paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.5,
          },
        });
        localStorage.setItem(`location-${idUser.current}`, JSON.stringify({ id: idUser.current, lng: lngLat.lng, lat: lngLat.lat }));
      }
    });

    // add user location dot
    navigator.geolocation.watchPosition(
      (position) => {
        // const { longitude, latitude } = position.coords;

        if (!userLocationDot.current) {
          // create user location dot
          //lat: -16.676058946542966 lng: -49.24000240042355
          userLocationDot.current = new mapboxgl.Marker({ color: "#00704A" })
            .setLngLat(start)
            .addTo(map.current);
          // console.log("lat: " + latitude + " lng:" + longitude)

          let i = 0;
          const interval = setInterval(() => {
            if (i >= route.length) {
              clearInterval(interval);
              return;
            }

            const coords = route[i].geometry.coordinates;
            // console.log(coords)
            userLocationDot.current.setLngLat(coords[1]);
            // setMarker((prevMarker) =>
            //   prevMarker.setLngLat(coords).addTo(map.current)
            // );

            i++;
          }, 1000);

          // cleanup function
          return () => clearInterval(interval);
          
        } else {
          // update user location dot
          //userLocationDot.current.setLngLat([longitude, latitude]);
          //console.log("lat: " + latitude + " lng:" + longitude)
          // set map center to user location
          // map.current.setCenter(start);
        }
        
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

  }, []);

  return <div ref={mapContainer} style={{ height: '90vh', width: '100vw'}} className="map-container" />;
};

export default MapboxMap;