import MapboxMapTesteDot from "../components/MapBoxMapTesteDot"
import { useRouter } from "next/router";

const mapa = () => {
    const router = useRouter();
    const { uid } = router.query;

    const center = { lng: -122.33, lat: 47.6 };
    const radius = 100;

    return (
        <div>
            <h1>Geofence</h1>
            {/* <MapboxMap center={center} radius={radius} /> */}
            {/* <div className="map" style={{backgroundColor: "red", height: "100%", width: "100%"}}> */}
                {/* <MapboxMapTeste /> */}
            {/* </div> */}
            <MapboxMapTesteDot uid={uid} />
        </div>
    );
};

export default mapa;