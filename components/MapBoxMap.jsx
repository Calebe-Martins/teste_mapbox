import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import supabase from "./functions/supabase"

// Define o token de acesso do Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapBoxMap = ({uid}) => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  // coordenadas iniciais do mapa -49.24, -16.68
  const [center, setCenter] = useState([-49.25, -16.68]);
  // raio inicial do círculo
  const [radius, setRadius] = useState(100);

  const uuid = useRef(uid)
  uuid.current = uid

  useEffect(() => {
    // Inicializa o mapa apenas uma vez
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 14,
    });

    const getData = async () => {
      // Verifica se já existe uma linha com a uid desejada no Supabase
      const { data, error } = await supabase.from('geofences').select('*').eq('uid', uuid.current);

      if (error) {
        console.error(error);
        // Exibição do erro no console
        return;
      }

      if (data && data.length > 0) {
        // Cria um círculo de geofencing
        const circle = turf.circle([data[0].lng, data[0].lat], radius, {
          steps: 64,
          units: "meters",
        });
        const geofence = {
          type: "FeatureCollection",
          features: [circle],
        };

        // Adiciona a fonte e a camada do círculo no mapa
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

    // Manipula o evento "load" do mapa
    map.current.on("load", (e) => {
      getData()
    });

    // Adiciona um listener de clique no mapa
    map.current.on("click", (event) => {
      // Remove a camada e a fonte do círculo se já existir
      if(map.current.getLayer(`circle-${uuid.current}`)) {
        map.current.removeLayer(`circle-${uuid.current}`)
        map.current.removeSource(`circle-${uuid.current}`)
      }
      
      const lngLat = event.lngLat;
      // Atualiza o centro com as coordenadas do clique
      setCenter([lngLat.lng, lngLat.lat]);
      // Atualiza o raio do círculo
      setRadius(100);
      // Cria um círculo de geofencing
      const circle = turf.circle([lngLat.lng, lngLat.lat], radius, {
        steps: 64,
        units: "meters",
      });
      const geofence = {
        type: "FeatureCollection",
        features: [circle],
      };

      // Adiciona a fonte e a camada do círculo no mapa
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
      
      // Interação com o banco de dados
      fetchData(uuid.current, lngLat.lat, lngLat.lng)
    });

    const fetchData = async (id, lat, lng) => {
      // Verifica se já existe uma linha com a uid desejada no Supabase
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

  // Retorna na tela uma div carregando o mapa e seus componentes criados acima
  return <div ref={mapContainer} style={{ height: '100vh', width: '100vw'}} className="map-container" />;
};

export default MapBoxMap;