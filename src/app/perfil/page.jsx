"use client";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Link from "next/link";
import api from '../../services/api';

export default function Perfil() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiPorta = process.env.NEXT_PUBLIC_API_PORTA;

    const router = useRouter();
    const [perfil, setPerfil] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login');
        } else {
            carregaPerfil(user.cod);
            // console.log(user.cod);            
        }

    }, []);

    async function carregaPerfil(user) {

        const dados = { id: user };

        try {
            const response = await api.post('/usuarios', dados);
            console.log(response.data.dados);
            setPerfil(response.data.dados);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }



    return (
        <div className="containerGlobal">
            <div className={styles.background}>
                <div className={styles.transparencia}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.card}>
                            <Link href="/" className={styles.titulo}>
                                <h1 className={styles.perfil}>Perfil</h1>
                            </Link>
                            {perfil.length > 0 ? (
                                perfil.map(infoUsu => (
                                    <div key={infoUsu.id} className={styles.parentContainer}>
                                        <div className={styles.PIContainer}>
                                            <div className={styles.profileContainer}>
                                                <div className={styles.imgContainer}>
                                                    <Image
                                                        src="/perfil.jpg"
                                                        alt="Foto de perfil"
                                                        width={512}
                                                        height={512}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.inputContainer}>

                                                <div className={styles.inputGroup}>
                                                    <label className={styles.textInput}>Nome completo:</label>
                                                    <p className={styles.infos}>{infoUsu.nome}</p>
                                                </div>
                                                <div className={styles.inputGroup}>
                                                    <label className={styles.textInput}>E-mail:</label>
                                                    <p className={styles.infos}>{infoUsu.email}</p>
                                                </div>

                                            </div>
                                        </div>
                                        <div className={styles.editar}>
                                            <Link href={`/perfil/${infoUsu.id}`}>
                                                <button className={styles.editarButton}>
                                                    <Image
                                                        src="/editar_perfil.png"
                                                        width={500}
                                                        height={500}
                                                        alt="Editar perfil"
                                                    />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1 className={styles.aviso}>Não há resultados para a requisição</h1>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
