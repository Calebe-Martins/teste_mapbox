import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import supabase from "../components/functions/supabase"

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc2NnIiwiYSI6ImNsY2YwMmQwZTNjaGwzcXFrZmV3Y3NwZGMifQ.U0tivVdJ4oHhnz5tUP6obg";

const MapboxMapTeste = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [center, setCenter] = useState([-49.25, -16.68]); // coordenadas iniciais do mapa -49.24, -16.68
  const [radius, setRadius] = useState(100); // raio inicial do círculo

  useEffect(() => {
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

    // Quando o usuario passar dentro do geofence tem que ativar a notificação

  }, [center, radius]);

  return <div ref={mapContainer} style={{ height: '90vh', width: '100vw'}} className="map-container" />;
};

export default MapboxMapTeste;
