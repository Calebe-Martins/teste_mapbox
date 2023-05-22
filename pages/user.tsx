import MapBoxUser from "../components/MapBoxUser";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import GetPromo from '../components/GetPromo'

export default function User() {

  return (
    <>
    <div className="container-fluid">
        <div className="row">
            <div className="col-lg-6">
                <div>
                    <MapBoxUser />
                </div>
                <div className="position-absolute top-0 start-0 p-3">
                    <Link href="/auth" className="btn btn-primary">
                        Fazer login
                    </Link>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="container" style={{backgroundColor: "#d3d3d3", height: "100vh" , overflow: "auto"}}>
                    <GetPromo />
                </div>
            </div>
        </div>
    </div>
    </>
  );
}