import React, { useEffect, useRef, useState } from "react";
import supabase from "./functions/supabase";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";

// Define o token de acesso ao Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapBoxMapUser = () => {
  // Referências para os elementos HTML
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userLocationDot = useRef(null);
  
  // Estados para as coordenadas do mapa, raio do círculo, ponto de partida e ponto de chegada
  const [center, setCenter] = useState([-49.25, -16.68]);
  const [radius, setRadius] = useState(100);
  const [start, setStart] = useState([-49.24000240042355, -16.676058946542966]);
  const [end, setend] = useState([-49.2467092280161, -16.677949457902557])
  
  useEffect(() => {
    // Calcula a rota entre os pontos de partida e chegada
    const line = turf.lineString([start, end]);
    const route = turf.lineChunk(line, 100, { units: "meters" }).features;

    // Inicializa o mapa apenas uma vez
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 14,
    });

    // Função para obter as áreas de geofencing
    const getGeofences = async () => {
      let { data: geofences, error } = await supabase
      .from('geofences')
      .select('*')

      // Verifica se ocorreu algum erro na consulta ao Supabase
      if (error) {
        console.error(error);
        return;
      } else {
        geofences.forEach((item) => {
          // Cria o círculo de geofencing
          const circle = turf.circle([item.lng, item.lat], radius, {
            steps: 64,
            units: "meters",
          });
          const geofence = {
            type: "FeatureCollection",
            features: [circle],
          };

          // Adiciona a fonte e a camada do círculo no mapa
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

    // Função para buscar informações sobre geofencing
    const fetchGeofence = async (uid) => {
      // Obtém os dados da tabela "promocao" do Supabase com base na uid e status ativo
      const { data: promocao, error } = await supabase
      .from('promocao')
      .select('*')
      .eq('uid', uid)
      .eq('ativo', true);

      // Verifica se ocorreu algum erro na consulta ao Supabase
      if (error) {
        console.log(error)
        return;
      }
      
      // Função para obter a data e hora atual formatada
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
      
      // Itera sobre os itens retornados da consulta ao Supabase
      promocao.forEach((item) => {
        // Verifica se a promoção já existe no localStorage
        const existingPromo = localStorage.getItem(`promo-${item.id}`);
        if (!existingPromo) {
          // Cria um objeto com os valores da promoção
          const localStorageValue = {
            id: item.id,
            uid: item.uid,
            titulo: item.descCurta,
            descLonga: item.descLonga,
            horaAtual: getCurrentDateTime(),
            ativo: item.ativo,
          };
          // Armazena a promoção no localStorage com a chave "promo-{item.id}"
          localStorage.setItem(`promo-${item.id}`, JSON.stringify(localStorageValue));
        }
      })
    }
        
    // Função para verificar se o usuário está dentro de alguma área de geofencing
    const getInside = async ([userLocation]) => {
      // Obtém os dados da tabela "geofences" do Supabase
      const { data: geofences, error } = await supabase
      .from('geofences')
      .select('*');
      
      // Verifica se ocorreu algum erro na consulta ao Supabase
      if (error) {
        console.error(error);
        return;
      }
      
      // Itera sobre os geofences retornados da consulta
      for (const geofence of geofences) {
        // Cria um círculo de geofencing com base nas coordenadas do geofence
        const circle = turf.circle([geofence.lng, geofence.lat], radius, {
          steps: 64,
          units: "meters",
        });
      
        // Verifica se a localização do usuário está dentro do círculo de geofencing
        if (turf.booleanPointInPolygon(userLocation, circle)) {
          // Chama a função fetchGeofence passando o uid do geofence
          fetchGeofence(geofence.uid)
        }
      }
    }
    
    // Função de retorno quando o mapa é carregado
    map.current.on("load", (e) => {
      // Chama a função getGeofences para obter os geofences
      getGeofences();
      // Adiciona o ponto de localização do usuário
      navigator.geolocation.watchPosition(
        (position) => {
          // Verifica se o ponto de localização do usuário já existe
          if (!userLocationDot.current) {
            // Cria o ponto de localização do usuário
            userLocationDot.current = new mapboxgl.Marker({ color: "#00704A" })
            .setLngLat(start)
            .addTo(map.current);
    
            let i = 0;
            const interval = setInterval(() => {
              // Verifica se o índice é maior ou igual ao comprimento da rota
              if (i >= route.length) {
                // Limpa o intervalo e retorna
                clearInterval(interval);
                return;
              }
    
              const coords = route[i].geometry.coordinates;
              // Chama a função getInside passando as coordenadas da rota
              getInside(coords)
              // Atualiza a posição do ponto de localização do usuário
              userLocationDot.current.setLngLat(coords[1]);
    
              i++;
            }, 1000);
    
            // Função de limpeza para limpar o intervalo quando o componente é desmontado
            return () => clearInterval(interval);
    
          } else {
            // Atualiza o ponto de localização do usuário
            // userLocationDot.current.setLngLat([longitude, latitude]);
          }
    
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    })
  }, []);

  return <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} className="map-container" />;
};
    
export default MapBoxMapUser;