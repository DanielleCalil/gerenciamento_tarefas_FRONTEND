"use client";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Link from "next/link";
import api from '../../services/api';

export default function PerfilEditar({ codUsu }) {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiPorta = process.env.NEXT_PUBLIC_API_PORTA;

    const imageLoader = ({ src, width, quality }) => {
        return `${apiUrl}:${apiPorta}${src}?w=${width}&q=${quality || 75}`;
    };

    const router = useRouter();
    const [isSaving, setIsSaving] = useState(null);

    const [perfilEdt, setPerfilEdt] = useState({
        id: '',
        nome: '',
        email: '',
        senha: null,
    });

    const [showModalConfirm, setShowModalConfirm] = useState(false);

    const openModalConfirm = () => setShowModalConfirm(true);
    const closeModalConfirm = () => setShowModalConfirm(false);

    const handleConfirm = async () => {
        try {
            closeModalConfirm();
            await handleSave();
        } catch (error) {
            console.error("Erro ao confirmar a ação:", error);
            alert('Ocorreu um erro ao tentar salvar. Por favor, tente novamente.');
        }
    };

    useEffect(() => {
        if (!codUsu) return;

        handleCarregaPerfil();
    }, [codUsu]);

    const handleCarregaPerfil = async () => {
        const dados = { id: codUsu };
        try {
            const response = await api.post('/usuarios', dados);
            if (response.data.sucesso) {
                const edtPerfilApi = response.data.dados[0];
                // console.log("Perfil carregado:", edtPerfilApi);
                setPerfilEdt(edtPerfilApi);
            } else {
                alert(response.data.mensagem);
            }
        } catch (error) {
            alert(error.response ? error.response.data.mensagem : 'Erro no front-end');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfilEdt(prev => ({ ...prev, [name]: value }));
    }

    const handleSave = async () => {
        const { nome, email } = perfilEdt;

        if (!email) {
            alert('Todos os campos devem ser preenchidos');
            return;
        }

        setIsSaving(true); // Inicia o salvamento

        try {
            const response = await api.patch(`/usuariosEditar/${perfilEdt.id}`, {
                ...perfilEdt,
            });

            if (response.data.sucesso) {
                alert('Usuário atualizado com sucesso!');
                router.push('/perfil');
            }
        } catch (error) {
            console.error("Erro ao salvar informações do usuário:", error);
            alert(error.response ? error.response.data.mensagem : 'Erro ao salvar informações. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="containerGlobal">
            <div className={styles.background}>
                <div className={styles.transparencia}>
                    <div className={styles.card}>
                        <Link href="/perfil" className={styles.titulo}>
                            <h1 className={styles.perfil}>Perfil</h1>
                        </Link>
                        {perfilEdt.id ? (
                            <div className={styles.PIContainer}>
                                <div className={styles.profileContainer}>
                                    <div className={styles.imgContainer}>
                                        <Image
                                            src="/perfil.jpg"
                                            alt="Foto de perfil"
                                            width={512}
                                            height={512}
                                            priority
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputContainer}>

                                    <div className={styles.inputGroup}>
                                        <p className={styles.textInput}>Nome completo:</p>
                                        <input
                                            type="text"
                                            value={perfilEdt.nome}
                                            onChange={(e) => setPerfilEdt({ ...perfilEdt, nome: e.target.value })}
                                            className={styles.inputField}
                                            aria-label="Nome Completo"
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.textInput}>E-mail:</label>
                                        <input
                                            type="email"
                                            value={perfilEdt.email}
                                            onChange={(e) => setPerfilEdt({ ...perfilEdt, email: e.target.value })}
                                            className={styles.inputField}
                                            aria-label="E-mail"
                                        />
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <h1 className={styles.aviso}>Não há resultados para a requisição</h1>
                        )}

                        <div className={styles.editar}>
                            <button
                                type="submit"
                                onClick={() => { handleSave() }}
                                className={styles.saveButton}
                            >
                                {isSaving ? 'Salvando...' : 'Salvar alterações'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
