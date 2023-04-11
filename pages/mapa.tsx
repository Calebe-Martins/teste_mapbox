import MapboxMap from "../components/MapboxMap1";
import MapboxMap2 from "../components/MapboxMap2"
import MapboxMapTeste from "../components/MapboxMapTeste"
import map from "@/styles/Mapa.module.css"
import MapboxMapTesteDot from "../components/MapBoxMapTesteDot"
import { useRouter } from 'next/router';

const GeofencePage = () => {
    const router = useRouter();
    const { id } = router.query;

    const center = { lng: -122.33, lat: 47.6 };
    const radius = 100;

    return (
        <div>
            <h1>Geofence</h1>
            {/* <MapboxMap center={center} radius={radius} /> */}
            {/* <div className="map" style={{backgroundColor: "red", height: "100%", width: "100%"}}> */}
                {/* <MapboxMapTeste /> */}
            {/* </div> */}
            <MapboxMapTesteDot id={id}/>
        </div>
    );
};

export default GeofencePage;