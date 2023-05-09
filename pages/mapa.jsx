import supabase from "../components/functions/supabase"
import MapBoxMap from "../components/MapBoxMap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import React, { useState } from 'react';

const Mapa = () => {
  const router = useRouter();
  const { uid } = router.query;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleCadastro() {
    const titulo = document.getElementById("descCurta").value;
    const desc = document.getElementById("descLonga").value;
    await supabase
    .from('promocao')
    .insert([
      { uid: uid, descCurta: titulo, descLonga: desc },
    ])
    .then(() => {
      console.log("Promoção cadastrada com sucesso!");
      handleClose
    })
    .catch((error) => {
      console.log(error)
    });

  }

  return (
    <>
      <div className="position-relative">
          <MapBoxMap uid={uid} />
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
              <h5 className="modal-title">Cadastro de promoção</h5>
              <button type="button" className="close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="">Titulo</label>
              <input type="text" id="descCurta" />
              <label htmlFor="">Descrição</label>
              <input type="text" id="descLonga" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Fechar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleCadastro}>
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