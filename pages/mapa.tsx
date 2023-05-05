import MapboxMapTesteDot from "../components/MapBoxMapTesteDot"
import { useRouter } from "next/router";

const Mapa = () => {
    const router = useRouter();
    const { uid } = router.query;

    return (
        <div>
            <h1>Geofence</h1>
            <MapboxMapTesteDot uid={uid} />
        </div>
    );
};

export default Mapa;