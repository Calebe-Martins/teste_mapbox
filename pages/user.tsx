import MapboxMapTeste2 from "../components/MapBoxUser";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import GetPromo from '../components/GetPromo'

export default function User() {

  return (
    <>
    <div className="container-fluid">
        <div className="row">
            <div className="col-lg-6 p-0 m-0">
                <div className="position-relative">
                <MapboxMapTeste2 />
                </div>
                <div className="position-absolute top-0 start-0 p-3">
                    <Link href="/auth" className="btn btn-primary">
                        Fazer login
                    </Link>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="container" style={{backgroundColor: "#d3d3d3", height: "100vh"}}>
                    <GetPromo />
                </div>
            </div>
        </div>
    </div>
    </>
  );
}