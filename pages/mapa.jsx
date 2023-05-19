import supabase from "../components/functions/supabase"
import MapBoxMap from "../components/MapBoxMap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';

const Mapa = () => {
  const router = useRouter();
  const { uid } = router.query;

  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function getPromo() {


    const { data, error } = await supabase
    .from('promocao')
    .select('*')
    .eq('uid', uid)
    .eq('ativo', true)

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      console.table(data)
      setItems(data)
    }
  }

  async function abreModalPegaPromo() {
    getPromo()
    handleShow()
  }
  
  async function handleCadastro() {
    const titulo = document.getElementById("descCurta").value;
    const desc = document.getElementById("descLonga").value;

    // Verifica se o campo "titulo" ou "descCurta" estão vazios
    if (!titulo || !desc) {
      console.error("Preencha todos os campos!");
      return;
    }

    await supabase
    .from('promocao')
    .insert([
      { uid: uid, descCurta: titulo, descLonga: desc },
    ])
    .then(() => {
      console.log("Promoção cadastrada com sucesso!");
      getPromo()
    })
    .catch((error) => {
      console.log(error)
    });

    titulo = ""
    desc = ""
  }

  const handleDeleteItem = async (index) => {
    const itemToDelete = items[index];

    // Atualiza a coluna "ativo" para false
    await supabase
      .from('promocao')
      .update({ ativo: false })
      .eq('id', itemToDelete.id);

    // Remove o item do array local
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  
  return (
    <>
      <div className="position-relative">
          <MapBoxMap uid={uid} />
      </div>
      <div className="position-absolute top-0 start-0 p-3">
          <button className="btn btn-primary" onClick={abreModalPegaPromo}>
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
              <div className="row">
                <div className="col-lg-12 form-group">
                  <label>Titulo</label>
                  <input className="form-control" type="text" id="descCurta" />
                </div>
                <div className="col-lg-12 form-group mt-3">
                  <label>Descrição</label>
                  <input className="form-control" type="text" id="descLonga" />
                </div>
              </div>
              <div className="mt-4">
                <ul className="list-group">
                  {/* Usando a função map para renderizar cada item em um loop */}
                  {items.map((item, index) => (
                    <li className="list-group-item  d-flex justify-content-between align-items-center" key={index}>
                      <span>{item.descCurta}</span>
                      <button
                        onClick={() => handleDeleteItem(index)} // Substitua handleDeleteItem pela função que você deseja chamar ao clicar no botão
                        className="delete-button close"
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
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

      <style jsx>{`
        .close {
          font-size: 1.5rem;
          font-weight: bold;
          color: red;
          padding: 0;
          background: none;
          border: none;
          outline: none;
          /* Adicione outros estilos personalizados aqui */
        }
        
      `}</style>

    </>
    
  );
};

export default Mapa;