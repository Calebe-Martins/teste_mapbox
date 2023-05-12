import React, { useEffect, useRef, useState } from "react";
import supabase from "./functions/supabase"
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapBoxMapUser = () => {

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

    const getGeofences = async () => {
        let { data: geofences, error } = await supabase
        .from('geofences')
        .select('*')

        if (error) {
            console.error(error);
            return;
        } else {
            geofences.forEach((item) => {
                // create geofencing circle
                const circle = turf.circle([item.lng, item.lat], radius, {
                    steps: 64,
                    units: "meters",
                });
                const geofence = {
                    type: "FeatureCollection",
                    features: [circle],
                };
            
                map.current.addSource(`circle-${item.uid}`, {
                    type: "geojson",
                    data: geofence,
                });
            
                map.current.addLayer({
                    id: `circle-${item.uid}`,
                    type: "fill",
                    source: `circle-${item.uid}`,
                    paint: {
                    "fill-color": "#ff0000",
                    "fill-opacity": 0.5,
                    },
                });
            })
        }
    }  

    const fetchGeofence = async (uid) => {
        const { data: promocao, error } = await supabase
        .from('promocao')
        .select('*')
        .eq('uid', uid)
        .eq('ativo', true);

        if (error) {
            console.log(error)
            return;
        }

        function getCurrentDateTime() {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
          
            const localDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          
            return localDateTime;
        }        

        promocao.forEach((item) => {
            const existingPromo = localStorage.getItem(`promo-${item.id}`);
            if (!existingPromo) {
                const localStorageValue = {
                    id: item.id,
                    uid: item.uid,
                    titulo: item.descCurta,
                    descLonga: item.descLonga,
                    horaAtual: getCurrentDateTime(),
                    ativo: item.ativo,
                };
                localStorage.setItem(`promo-${item.id}`, JSON.stringify(localStorageValue));
            }
        })
    }

    const getInside = async ([userLocation]) => {
        // check if user is inside any geofence
        const { data: geofences, error } = await supabase
        .from('geofences')
        .select('*');

        if (error) {
        console.error(error);
        return;
        }

        for (const geofence of geofences) {
            const circle = turf.circle([geofence.lng, geofence.lat], radius, {
                steps: 64,
                units: "meters",
            });

            if (turf.booleanPointInPolygon(userLocation, circle)) {
                fetchGeofence(geofence.uid)
            }
        }
    }

    map.current.on("load", (e)=>{
        getGeofences()
        // add user location dot
        navigator.geolocation.watchPosition(
        (position) => {
            // const { longitude, latitude } = position.coords;

            if (!userLocationDot.current) {
                // create user location dot
                userLocationDot.current = new mapboxgl.Marker({ color: "#00704A" })
                .setLngLat(start)
                .addTo(map.current);


                let i = 0;
                const interval = setInterval(() => {
                    if (i >= route.length) {
                    clearInterval(interval);
                    return;
                    }
                    
                    const coords = route[i].geometry.coordinates;
                    getInside(coords)
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
            // set map center to user location
            // map.current.setCenter(start);

            // QUANDO O CARA ANDAR VERIFICAR SE JÁ PASSOU O TEMPO
          }
          
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    })

    

  }, []);

  return <div ref={mapContainer} style={{ height: '100vh', width: '50vw'}} className="map-container" />;
};

export default MapBoxMapUser;