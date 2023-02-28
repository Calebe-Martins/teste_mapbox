import MapboxMap from "../components/MapboxMap";
import map from "@/styles/Mapa.module.css"

const GeofencePage = () => {
    const center = { lng: -122.33, lat: 47.6 };
    const radius = 100;

    return (
        <div>
            <h1>Geofence</h1>
            <MapboxMap center={center} radius={radius} />
        </div>
    );
};

export default GeofencePage;