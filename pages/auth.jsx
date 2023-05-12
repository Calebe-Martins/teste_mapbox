import supabase from "../components/functions/supabase"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router'
import { useState } from "react";

export default function Auth() {
    const [activeTab, setActiveTab] = useState("login");
    const [error, setError] = useState(null);
    const router = useRouter()

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
                        setError("Acessando. Aguarde")
                        router.push(`/mapa?uid=${data[0].uid}`)
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
    <div className="container">
        <div id="login" className={`tab-content ${activeTab === "login" ? "active" : ""}`}>
            <div className="card">
                <div className="card-header">
                    <h3>Login</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        {/* conteúdo da tab de login */}
                        <div className="col-lg-12 form-group">
                            <label>CPF</label>
                            <input className="form-control" type="text" id="cpf-login" placeholder="000.000.000-00" />
                        </div>
                        <div className="col-lg-12 form-group mt-3">
                            <label>Senha</label>
                            <input className="form-control" type="password" id="senha-login" placeholder="********" />
                        </div>
                        {error && <p>{error}</p>}
                    </div>
                    <div className="row mt-4">
                        <div className="col-lg-12">
                            <input className="btn btn-primary" type="button" value="Entrar" onClick={handleLogin} />
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-lg-12 d-flex">
                            <div>Não tem uma conta?&nbsp;</div>
                            <a  className={`tab ${activeTab === "cadastro" ? "active" : ""}`}
                                onClick={() => handleTabClick("cadastro")}>Cadastre-se
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="cadastro" className={`tab-content ${activeTab === "cadastro" ? "active" : ""}`}>
            <div className="card">
                <div className="card-header">
                    <h3>Cadastro</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        {/* conteúdo da tab de cadastro */}
                        <div className="col-lg-12 form-group">
                            <label>Nome</label>
                            <input className="form-control" type="text" id="nome" placeholder="Exemplo da Silva" />
                        </div>
                        <div className="col-lg-12 form-group mt-3">
                            <label>CPF</label>
                            <input className="form-control" type="text" id="cpf-cadastro" placeholder="000.000.000-00" />
                        </div>
                        <div className="col-lg-12 form-group mt-3">
                            <label>Senha</label>
                            <input className="form-control" type="password" name="senha-cadastro" id="senha-cadastro" placeholder="********" />
                        </div>
                        <div className="col-lg-12 form-group mt-3">
                            <label>Confirmar Senha</label>
                            <input className="form-control" type="password" name="senha-confirmar" id="confirmar-senha" placeholder="********" />
                        </div>
                    </div>
                    {error && <p>{error}</p>}
                    <div className="row mt-4">
                        <div className="col-lg-12">
                            <input className="btn btn-primary" type="button" value="Cadastrar" onClick={handleCadastro} />
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-lg-12 d-flex">
                            <div>Já tem uma conta?&nbsp;</div>
                            <a className={`tab ${activeTab === "login" ? "active" : ""}`}
                                onClick={() => handleTabClick("login")}>Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>

        <style jsx>{`
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
