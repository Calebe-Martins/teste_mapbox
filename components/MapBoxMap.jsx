import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import supabase from "./functions/supabase"

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapBoxMap = ({uid}) => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [center, setCenter] = useState([-49.25, -16.68]); // coordenadas iniciais do mapa -49.24, -16.68
  const [radius, setRadius] = useState(100); // raio inicial do círculo

  const uuid = useRef(uid)
  uuid.current = uid

  useEffect(() => {

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
        // Talvez voltar pra pagina de login se n tever id
        return;
      }

      if (data && data.length > 0) {
        // setCenter([data[0].lng, data[0].lat]);
        // setRadius(100);
  
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
      // setCenter([lngLat.lng, lngLat.lat]);
      // setRadius(100);

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

  }, [center, radius]);

  return <div ref={mapContainer} style={{ height: '100vh', width: '100vw'}} className="map-container" />;
};

export default MapBoxMap;