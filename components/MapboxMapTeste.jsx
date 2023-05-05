import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import supabase from "../components/functions/supabase"

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapboxMapTeste = () => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const userLocationDot = useRef(null);
  const [center, setCenter] = useState([-49.25, -16.68]); // coordenadas iniciais do mapa -49.24, -16.68
  const [radius, setRadius] = useState(100); // raio inicial do círculo
  const [start, setStart] = useState([-49.24000240042355, -16.676058946542966]);
  const [end, setend] = useState([-49.2467092280161, -16.677949457902557])

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

    const fetchData = async () => {
      // Carregar todos os geofences
    }

    map.current.on("click", (event) => {
      const lngLat = event.lngLat;
      console.log("lng: " + lngLat.lng + " lat: " + lngLat.lat)
    });
    // add user location dot
    navigator.geolocation.watchPosition(
      (position) => {
        // const { longitude, latitude } = position.coords;
        if (!userLocationDot.current) {
          // create user location dot
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
          // userLocationDot.current.setLngLat([lngLat.lng, lngLat.lat]);
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

    // Quando o usuario passar dentro do geofence tem que ativar a notificação

  }, [center, radius]);

  return <div ref={mapContainer} style={{ height: '90vh', width: '100vw'}} className="map-container" />;
};

export default MapboxMapTeste;
