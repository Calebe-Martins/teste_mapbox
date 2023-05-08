import MapboxMapTeste2 from "../components/MapboxMapTeste2";
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import Slider from 'react-slick';


export default function User() {
    // const settings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3,
    //     slidesToScroll: 3,
    //     draggable: true,
    // };

  return (
    <>
    <div className="container-fluid">
        <div className="row">
            <div className="col-lg-6 p-0 m-0">
                <div className="position-relative">
                <MapboxMapTeste2 />
                </div>
                <div className="position-absolute top-0 start-0 p-3">
                    <a href="/auth" className="btn btn-primary">
                        Fazer login
                    </a>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="container" style={{backgroundColor: "#d3d3d3", height: "100vh"}}>
                    
                {/* <Slider {...settings}>
                    <div>
                        <h3>Item 1</h3>
                    </div>
                    <div>
                        <h3>Item 2</h3>
                    </div>
                    <div>
                        <h3>Item 3</h3>
                    </div>
                    <div>
                        <h3>Item 1</h3>
                    </div>
                    <div>
                        <h3>Item 2</h3>
                    </div>
                    <div>
                        <h3>Item 3</h3>
                    </div>
                    <div>
                        <h3>Item 1</h3>
                    </div>
                    <div>
                        <h3>Item 2</h3>
                    </div>
                    <div>
                        <h3>Item 3</h3>
                    </div>
                    <div>
                        <h3>Item 1</h3>
                    </div>
                    <div>
                        <h3>Item 2</h3>
                    </div>
                    <div>
                        <h3>Item 3</h3>
                    </div>
                </Slider> */}

                </div>
            </div>
        </div>
    </div>
    </>
  );
}