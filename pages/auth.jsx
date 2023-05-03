import { useState } from "react";

export default function auth() {

    const [activeTab, setActiveTab] = useState("login");

    function handleTabClick(tab) {
        setActiveTab(tab);
    }

    return(
    <>
        <div id="login" className={`tab-content ${activeTab === "login" ? "active" : ""}`}>
            {/* conteúdo da tab de login */}
            np
            <button
                className={`tab ${activeTab === "cadastro" ? "active" : ""}`}
                onClick={() => handleTabClick("cadastro")}>Cadastro
            </button>
        </div>

        <div id="cadastro" className={`tab-content ${activeTab === "cadastro" ? "active" : ""}`}>
            <label htmlFor="">Nome</label>
            <input type="text" id="nome" placeholder="Exemplo da Silva" />
            <label htmlFor="">CPF</label>
            <input type="text" id="cpf" placeholder="000.000.000-00" />
            <label htmlFor="">Senha</label>
            <input type="password" name="senha" id="senha" placeholder="********" />
            <label htmlFor="">Confirmar Senha</label>
            <input type="password" name="senha" id="senha" placeholder="********" />
            <button
                className={`tab ${activeTab === "login" ? "active" : ""}`}
                onClick={() => handleTabClick("login")}>Login
            </button>
        </div>

        <style jsx>{`
            // .tab {
            // background-color: #eee;
            // border: none;
            // padding: 10px;
            // margin-right: 10px;
            // cursor: pointer;
            // }

            .tab.active {
            background-color: #ccc;
            }

            .tab-content {
            display: none;
            }

            .tab-content.active {
            display: block;
            }
        `}</style>
    </>
    )
}
