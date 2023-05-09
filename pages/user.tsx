import MapboxMapTeste2 from "../components/MapboxMapTeste2";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export default function User() {
  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      draggable: true,
  };

  function getPromoDataFromLocalStorage() {
    const promoData: Array<{ key: string; data: string }> = [];
  
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("promo-")) {
        const data = localStorage.getItem(key);
  
        if (data !== null) {
          promoData.push({
            key: key,
            data: data,
          });
        }
      }
    });
  
    return promoData;
  }
  
  // Exemplo de uso da função
  const promoData = getPromoDataFromLocalStorage();
  console.log(promoData);

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
                    
                <Slider {...settings}>
                </Slider>

                </div>
            </div>
        </div>
    </div>
    </>
  );
}