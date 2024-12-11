"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import api from "../../services/api";

import styles from "./page.module.css";

export default function ModalEditarTarefa({ show, onClose, inform }) {
    if (!show) return null;
    const router = useRouter();

    useEffect(() => {
        if (inform) {
            setEdtTarefa(inform);
        }
    }, [inform]);

    const user = JSON.parse(localStorage.getItem('user'));

    const [edtTarefa, setEdtTarefa] = useState({
        id: "",
        titulo: "",
        descricao: "",
        status: ""
    });

    const valDefault = styles.formControl;
    const valSucesso = styles.formControl + ' ' + styles.success;
    const valErro = styles.formControl + ' ' + styles.error;

    // validação
    const [valida, setValida] = useState({
        titulo: {
            validado: valDefault,
            mensagem: []
        },
        descricao: {
            validado: valDefault,
            mensagem: []
        },
    });

    const handleChange = (e) => {
        setEdtTarefa(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function validaTitulo() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (!edtTarefa?.titulo || edtTarefa.titulo.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o nome completo da tarefa');
        }

        setValida(prevState => ({
            ...prevState,
            titulo: objTemp
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaDescricao() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (!edtTarefa?.descricao || edtTarefa.descricao.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A descrição da tarefa é obrigatória');
        }

        setValida(prevState => ({
            ...prevState,
            descricao: objTemp
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let itensValidados = 0;

        itensValidados += validaTitulo();
        itensValidados += validaDescricao();

        if (itensValidados === 2) {

            let response;

            let edtComId = {
                userId: user.cod,
                id: edtTarefa.id,
                titulo: edtTarefa.titulo,
                descricao: edtTarefa.descricao,
                status: edtTarefa.status,
            };

            try {
                if (edtTarefa.id) {
                    response = await api.patch(`/tarefasEditar/${edtTarefa.id}`, edtComId);
                } else {
                    alert("ID da tarefa não encontrado");
                }

                if (response.data.sucesso) {
                    alert("Tarefa editada com sucesso!");
                    setEdtTarefa((prevEdtTarefas) => {
                        const tarefaEditada = Array.isArray(prevEdtTarefas) ? prevEdtTarefas : [];
                        return [...tarefaEditada]
                    });
                    setEdtTarefa({ id: '', titulo: '', descricao: '', status: '' });
                    onClose();
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

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <form className={styles.conteudo} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <div className={valida.titulo.validado + ' ' + styles.valTitulo} id="valTitulo">
                            <p className={styles.textInput}>Título:</p>
                            <div className={styles.divInput}>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={edtTarefa.titulo}
                                    className={styles.inputField}
                                    onChange={handleChange}
                                />
                                <IoCheckmarkCircleOutline className={styles.sucesso} />
                                <IoAlertCircleOutline className={styles.erro} />
                            </div>
                            {
                                valida.titulo.mensagem.map(mens => <small key={mens} id="autTitulo" className={styles.small}>{mens}</small>)
                            }
                        </div>

                        <div className={valida.descricao.validado + ' ' + styles.valDescricao} id="valDescricao">
                            <p className={styles.textInput}>Descrição:</p>
                            <div className={styles.divInput}>
                                <input
                                    type="text"
                                    name="descricao"
                                    value={edtTarefa.descricao}
                                    className={styles.inputField}
                                    onChange={handleChange}
                                />
                                <IoCheckmarkCircleOutline className={styles.sucesso} />
                                <IoAlertCircleOutline className={styles.erro} />
                            </div>
                            {
                                valida.descricao.mensagem.map(mens => <small key={mens} id="autDescricao" className={styles.small}>{mens}</small>)
                            }
                        </div>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button
                            type="submit"
                            className={styles.modalButtonAdd}
                        >
                            Adicionar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.modalButtonCanc}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
