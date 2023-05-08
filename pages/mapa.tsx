import MapboxMapTesteDot from "../components/MapBoxMapTesteDot"
import { useRouter } from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

const Mapa = () => {
    const router = useRouter();
    const { uid } = router.query;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function cadastroPromo() {
        console.log(uid)
    }

    return (
        <>
        <div className="position-relative">
            <MapboxMapTesteDot uid={uid} />
        </div>
        <div className="position-absolute top-0 start-0 p-3">
            <button className="btn btn-primary" onClick={handleShow}>
                Promoçoes
            </button>
        </div>

        {show && (
        <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Título da Modal</h5>
                <button type="button" className="close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Conteúdo da Modal</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Fechar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleClose}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {show && <div className="modal-backdrop fade show"></div>}

        </>
    );
};

export default Mapa;