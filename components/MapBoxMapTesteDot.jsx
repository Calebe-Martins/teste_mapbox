import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import supabase from "../components/functions/supabase"

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapboxMap = ({uid}) => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const userLocationDot = useRef(null);
  const [center, setCenter] = useState([-49.25, -16.68]); // coordenadas iniciais do mapa -49.24, -16.68
  const [radius, setRadius] = useState(100); // raio inicial do círculo
  const [start, setStart] = useState([-49.24000240042355, -16.676058946542966]);
  const [end, setend] = useState([-49.2467092280161, -16.677949457902557])

  const uuid = useRef(uid)
  uuid.current = uid

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

    
    const getData = async () => {
      // Verifica se já existe uma linha com a uid desejada
      const { data, error } = await supabase.from('geofences').select('*').eq('uid', uuid.current);

      if (error) {
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setCenter([data[0].lng, data[0].lat]);
        setRadius(100);
  
        // create geofencing circle
        const circle = turf.circle([data[0].lng, data[0].lat], radius, {
          steps: 64,
          units: "meters",
        });
        const geofence = {
          type: "FeatureCollection",
          features: [circle],
        };
  
        map.current.addSource(`circle-${data[0].uid}`, {
          type: "geojson",
          data: geofence,
        });
  
        map.current.addLayer({
          id: `circle-${data[0].uid}`,
          type: "fill",
          source: `circle-${data[0].uid}`,
          paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.5,
          },
        });
      }
    }


    map.current.on("load", (e) => {
      getData()
    });

    // add click listener to map
    map.current.on("click", (event) => {
      if(map.current.getLayer(`circle-${uuid.current}`)) {
        map.current.removeLayer(`circle-${uuid.current}`)
        map.current.removeSource(`circle-${uuid.current}`)
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

      map.current.addSource(`circle-${uuid.current}`, {
        type: "geojson",
        data: geofence,
      });

      map.current.addLayer({
        id: `circle-${uuid.current}`,
        type: "fill",
        source: `circle-${uuid.current}`,
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.5,
        },
      });

      fetchData(uuid.current, lngLat.lat, lngLat.lng)
    });

    const fetchData = async (id, lat, lng) => {
      // Verifica se já existe uma linha com a uid desejada
      const { data, error } = await supabase.from('geofences').select('*').eq('uid', id);
    
      if (error) {
        console.error(error);
        return;
      }
    
      if (data && data.length > 0) {
        // Atualiza as colunas lat e lng da linha existente
        const { error } = await supabase.from('geofences').update({ lat: lat, lng: lng }).eq('uid', id);
    
        if (error) {
          console.error(error);
          return;
        }
    
        console.log('Atualizado com sucesso!');
      } else {
        // Insere uma nova linha com as informações
        const { error } = await supabase.from('geofences').insert({ uid: id, lat: lat, lng: lng });
    
        if (error) {
          console.error(error);
          return;
        }
    
        console.log('Inserido com sucesso!');
      }
    }

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