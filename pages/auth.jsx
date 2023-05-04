import { useState } from "react";
import { useRouter } from 'next/router'
import supabase from "../components/functions/supabase"

export default function auth() {

    const [activeTab, setActiveTab] = useState("login");
    const [error, setError] = useState("");

    function handleTabClick(tab) {
        setActiveTab(tab);
        setError("");
    }
    

    async function handleLogin() {
        const cpf = document.getElementById("cpf-login").value;
        const senha = document.getElementById("senha-login").value;
    
        // Verifica se todos os campos estão preenchidos
        if (!cpf || !senha) {
            setError("Preencha todos os campos!");
            return;
        }

        // Verifica se as credenciais estão corretas
        await supabase
            .from("usuario")
            .select("*")
            .eq("cpf", cpf)
            .eq("senha", senha)
            .then(({ data }) => {
                if (data && data.length > 0) {
                    if (data[0].acesso) {
                        // Credenciais corretas, usuário logado com sucesso
                        setError("Usuario Logado");
                    } else {
                        setError("Peça permissão de acesso")
                    }
                } else {
                    setError("Credenciais incorretas!");
                }
            })
            .catch((error) => {
            setError("Erro ao buscar usuários!");
            console.log(error)
        });
    }

    async function handleCadastro() {
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf-cadastro').value;
        const senha = document.getElementById('senha-cadastro').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

         // Verifica se todos os campos estão preenchidos
        if (!nome || !cpf || !senha || !confirmarSenha) {
            setError("Preencha todos os campos!");
            return;
        }

        // Verifica se as senhas são iguais
        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem!");
            return;
        }

        // Verifica se já existe um usuário com esse CPF cadastrado
        await supabase
            .from("usuario")
            .select("*")
            .eq("cpf", cpf)
            .then(({ data }) => {
            if (data && data.length > 0) {
                setError("Usuário já cadastrado!");
            } else {
                // Insere o novo usuário no banco de dados
                supabase
                .from("usuario")
                .insert({ nome, cpf, senha })
                .then(() => {
                    setSuccess("Usuário cadastrado com sucesso!");
                })
                .catch((error) => {
                    setError("Erro ao cadastrar usuário!");
                    console.log(error)
                });
            }
            })
            .catch((error) => {
                setError("Erro ao buscar usuários!");
                console.log(error)
            });
        setActiveTab("login");
    }

    return(
    <>
        <div id="login" className={`tab-content ${activeTab === "login" ? "active" : ""}`}>
            {/* conteúdo da tab de login */}
            <label htmlFor="">CPF</label>
            <input type="text" id="cpf-login" placeholder="000.000.000-00" />
            <label htmlFor="">Senha</label>
            <input type="password" name="senha-login" id="senha-login" placeholder="********" />
            {error && <p>{error}</p>}
            <input type="button" value="Entrar" onClick={handleLogin} />
            <button
                className={`tab ${activeTab === "cadastro" ? "active" : ""}`}
                onClick={() => handleTabClick("cadastro")}>Cadastre-se
            </button>
        </div>

        <div id="cadastro" className={`tab-content ${activeTab === "cadastro" ? "active" : ""}`}>
            {/* conteúdo da tab de cadastro */}
            <label htmlFor="">Nome</label>
            <input type="text" id="nome" placeholder="Exemplo da Silva" />
            <label htmlFor="">CPF</label>
            <input type="text" id="cpf-cadastro" placeholder="000.000.000-00" />
            <label htmlFor="">Senha</label>
            <input type="password" name="senha-cadastro" id="senha-cadastro" placeholder="********" />
            <label htmlFor="">Confirmar Senha</label>
            <input type="password" name="senha-confirmar" id="confirmar-senha" placeholder="********" />
            {error && <p>{error}</p>}
            <input type="button" value="Cadastrar" onClick={handleCadastro} />
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
