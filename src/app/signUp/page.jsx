"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import InputMask from 'react-input-mask';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { IoEye, IoEyeOff, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";

import api from '../../services/api';


export default function SignUp() {
    const router = useRouter();

    const [usuario, setUsuario] = useState({
        nome: '',
        email: '',
        senha: '',
        confSenha: ''
    });

    const valDefault = styles.formControl;
    const valSucesso = styles.formControl + ' ' + styles.success;
    const valErro = styles.formControl + ' ' + styles.error;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // validação
    const [valida, setValida] = useState({
        nome: {
            validado: valDefault,
            mensagem: []
        },
        email: {
            validado: valDefault,
            mensagem: []
        },
        senha: {
            validado: valDefault,
            mensagem: []
        },
        confSenha: {
            validado: valDefault,
            mensagem: []
        },
    });

    const handleChange = (e) => {
        setUsuario(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function validaNome() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (usuario.nome === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O nome do usuário é obrigatório');
        } else if (usuario.nome.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o nome completo do usuário');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            nome: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function checkEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        );
    }

    function validaEmail() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.email === "") {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O e-mail do usuário é obrigatório');
        } else if (!checkEmail(usuario.email)) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira um e-mail válido');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            email: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;

    }

    function validaSenha() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        // Expressão regular para validar a senha
        const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (usuario.senha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O preenchimento da senha é obrigatório');
        } else if (!senhaForteRegex.test(usuario.senha)) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Use uma senha forte com pelo menos 8 caracteres, combinando letras, números e símbolos.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            senha: objTemp // atualiza apenas o campo 'senha'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }


    function validaConfSenha() {

        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.confSenha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A confirmação da senha é obrigatória');
        } else if (usuario.confSenha !== usuario.senha) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A senha e a confirmação devem ser iguais');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            confSenha: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }


    async function handleSubmit(event) {
        event.preventDefault();
        let itensValidados = 0;

        itensValidados += validaNome();
        itensValidados += validaEmail();
        itensValidados += validaSenha();
        itensValidados += validaConfSenha();

        if (itensValidados === 4) {
            try {
                const response = await api.post('/usuariosCadastrar', usuario);
                if (response.data.sucesso) {
                    alert('Usuário cadastrado!');
                    router.push('/login');
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.mensagem + '\n' + error.response.data.dados);
                } else {
                    alert('Erro no front-end' + '\n' + error);
                }
            }
        }
    }
    console.log(usuario);


    return (
        <div className="containerGlobal">
            <div className={styles.background}>
                <div className={styles.transparencia}>
                    <div className={styles.container}>
                        <div className={styles.card}>
                            {/* <div className={styles.imgContainer}>
                        <Image
                            src="/imagens_telas/img_cadastro.png"
                            alt="Imagem tela de cadastro"
                            className={styles.imgCadastro}
                            width={500}
                            height={453}
                        />
                        </div> */}
                            <div className={styles.conteudo}>
                                <h1 className={styles.cadastro}>Cadastro</h1>
                                <form id="form" onSubmit={handleSubmit}>

                                    <div className={valida.nome.validado + ' ' + styles.valNome} id="valNome">
                                        <div className={styles.divInput}>
                                            <input
                                                type="text"
                                                name="nome"
                                                placeholder="Nome completo"
                                                className={styles.inputField}
                                                onChange={handleChange}
                                            />
                                            <IoCheckmarkCircleOutline className={styles.sucesso} />
                                            <IoAlertCircleOutline className={styles.erro} />
                                        </div>
                                        {
                                            valida.nome.mensagem.map(mens => <small key={mens} id="nome" className={styles.small}>{mens}</small>)
                                        }
                                    </div>

                                    <div className={valida.email.validado + ' ' + styles.valNome} id="valEmail">
                                        <div className={styles.divInput}>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="E-mail"
                                                className={styles.inputField}
                                                onChange={handleChange}
                                            />
                                            <IoCheckmarkCircleOutline className={styles.sucesso} />
                                            <IoAlertCircleOutline className={styles.erro} />
                                        </div>
                                        {
                                            valida.email.mensagem.map(mens => <small key={mens} id="email" className={styles.small}>{mens}</small>)
                                        }
                                    </div>

                                    <div className={styles.doisItens}>
                                        <div className={styles.passwordRow}>
                                            <div className={styles.passwordContainer}>
                                                <div className={valida.senha.validado} id="validaSn1">
                                                    <div className={styles.divInput}>
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            name="senha"
                                                            placeholder="Senha"
                                                            className={`${styles.inputField} ${styles.senhaField}`}
                                                            onChange={handleChange}
                                                        />
                                                        <IoCheckmarkCircleOutline className={styles.sucesso} />
                                                        <IoAlertCircleOutline className={styles.erro} />
                                                        <span
                                                            onClick={togglePasswordVisibility}
                                                            className={styles.eyeIcon}
                                                        >
                                                            {showPassword ? <IoEyeOff /> : <IoEye />}
                                                        </span>
                                                    </div>
                                                    {
                                                        valida.senha.mensagem.map(mens => <small key={mens} id="senha" className={styles.small}>{mens}</small>)
                                                    }
                                                </div>
                                            </div>


                                            <div className={styles.passwordContainer}>
                                                <div className={valida.confSenha.validado} id="validaSn2">
                                                    <div className={styles.divInput}>
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            name="confSenha"
                                                            placeholder="Confirmar senha"
                                                            className={`${styles.inputField} ${styles.senhaField}`}
                                                            onChange={handleChange}
                                                        />
                                                        <IoCheckmarkCircleOutline className={styles.sucesso} />
                                                        <IoAlertCircleOutline className={styles.erro} />
                                                        <span
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            className={styles.eyeIcon}
                                                        >
                                                            {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                                        </span>
                                                    </div>
                                                    {
                                                        valida.confSenha.mensagem.map(mens => <small key={mens} id="confSenha" className={styles.small}>{mens}</small>)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.logar}>
                                        Já tem uma conta? <Link href="/login">Faça login</Link>
                                    </div>

                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        className={styles.cadastroButton}
                                    >
                                        Fazer cadastro
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
