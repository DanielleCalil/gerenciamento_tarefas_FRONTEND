"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { IoLogOutOutline, IoPersonOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

import api from '../services/api';

export default function Tarefas() {
  const situacaoOptions = [
    { value: 'pendente', label: 'Pendentes' },
    { value: 'concluida', label: 'Concluídas' }
  ];

  const [isSaving, setIsSaving] = useState(false);
  const [filtroSituacao, setFiltroSituacao] = useState('');
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const router = useRouter();

  function logOff() {
    localStorage.clear();
    router.push('/login');
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      router.push('/login');
    } else {
      
    }
  }, []);

  const valDefault = styles.formControl;
  const valSucesso = styles.formControl + ' ' + styles.success;
  const valErro = styles.formControl + ' ' + styles.error;

  useEffect(() => {
    const carregarTarefas = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log("Usuário no localStorage:", user);
      if (!user) {
        router.push('/login');
        return;
      }
  
      console.log("User Cod enviado na requisição:", user.cod);
      try {
        const response = await api.post('/tarefas', { userId: user.cod });
        console.log("Tarefas recebidas:", response.data.dados);
        setTarefas(response.data.dados);
      } catch (error) {
        console.error("Erro ao carregar as tarefas", error);
      }
    };
  
    carregarTarefas();
  }, []);
  
  

  useEffect(() => {
    if (filtroSituacao) {
      const tarefasFiltradas = tarefas.filter(tarefa => tarefa.status === filtroSituacao);
      setTarefasFiltradas(tarefasFiltradas);
    } else {
      setTarefasFiltradas(tarefas);
    }
  }, [filtroSituacao, tarefas]);


  async function deletaTarefas(id) {

    try {
      const response = await api.delete(`/tarefasDeletar/${id}`);

      if (response.data && response.data.sucesso) {
        const tarefasRecarregadas = await api.post('/tarefas');
        setTarefas(tarefasRecarregadas.data.dados);
        console.log('Tarefa excluída com sucesso:', id);
      } else {
        console.error('Erro ao excluir a tarefa:', response.data.mensagem);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.mensagem + '\n' + error.response.data.dados);
      } else {
        alert('Erro no front-end: ' + error.message);
      }
    }
  }

  async function confirmarTarefa(id) {
    try {
      const response = await api.post(`/tarefasConfirmar/${id}`);

      if (response.data && response.data.sucesso) {
        const tarefasRecarregadas = await api.post('/tarefas');
        setTarefas(tarefasRecarregadas.data.dados);

        console.log('Tarefa concluída com sucesso:', id);
      } else {
        console.error('Erro ao concluir a tarefa:', response.data.mensagem);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.mensagem + '\n' + error.response.data.dados);
      } else {
        alert('Erro no front-end: ' + error.message);
      }
    }
  }

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

  function validaTitulo() {

    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (!tarefas?.titulo || tarefas.titulo.length < 5) {
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

    if (!tarefas?.descricao || tarefas.descricao.length < 5) {
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
      try {
        const response = await api.post('/tarefasCadastrar', tarefaComUserId);
        console.log('Resposta da API:', response);
  
        if (response.data.sucesso) {
          window.location.reload(); 
        }
      } catch (error) {
        console.log('Erro na requisição:', error);
  
        if (error.response) {
          alert(error.response.data.mensagem + '\n' + error.response.data.dados);
        } else {
          alert('Erro no front-end' + '\n' + error);
        }
      }
    }
  }
  console.log(tarefas);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefas(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="containerGlobal">
      <div className={styles.background}>
        <div className={styles.editarb}>
          <button
            className={styles.sairMenuGrande}
            onClick={() => logOff()}>
            <IoLogOutOutline className={styles.tpiconSair} />
            Sair
          </button>
        </div>
        <div className={styles.transparencia}>
          <div className={styles.conteudo}>
            <div className={styles.card}>
              <div className={styles.header}>

                <Link href="/" className={styles.titulo}>
                  <h1>Tarefas</h1>
                </Link>

                <div className={styles.editarEdi}>
                  <button
                    className={styles.perfilButton}
                    onClick={() => router.push("/perfil")}>
                    <IoPersonOutline className={styles.tpicon} />
                    Perfil
                  </button>
                </div>

              </div>

              <form id="form" onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                  <div className={styles.inputGroup}>
                    <div className={styles.inputFlex}>

                      <div className={styles.inputMargin}>
                        <span className={styles.titleSuperior}>Título da tarefa:</span>
                        <div className={valida.titulo.validado + ' ' + styles.valTitulo} id="valTitulo">
                          <div className={styles.divInput}>
                            <input
                              type="text"
                              value={tarefas.titulo}
                              onChange={(e) => setTarefas({ ...tarefas, titulo: e.target.value })}
                              className={`${styles.inputField} ${styles.nomeInput}`}
                              aria-label="Titulo da tarefa"
                            />
                            <IoCheckmarkCircleOutline className={styles.sucesso} />
                            <IoAlertCircleOutline className={styles.erro} />
                          </div>
                          {
                            valida.titulo.mensagem.map(mens => <small key={mens} id="titulo" className={styles.small}>{mens}</small>)
                          }
                        </div>
                      </div>

                      <div className={styles.editar}>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className={styles.saveButton}
                        >
                          {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>

                    <div className={styles.inputMargin}>
                      <span className={styles.titleSuperior}>Descrição da tarefa:</span>
                      <div className={valida.descricao.validado + ' ' + styles.validaDescricao} id="valDescricao">
                        <div className={styles.divInput}>
                          <input
                            type="text"
                            value={tarefas.descricao}
                            onChange={(e) => setTarefas({ ...tarefas, descricao: e.target.value })}
                            className={`${styles.inputField} ${styles.nomeInput}`}
                            aria-label="Descrição da tarefa"
                          />
                          <IoCheckmarkCircleOutline className={styles.sucesso} />
                          <IoAlertCircleOutline className={styles.erro} />
                        </div>
                        {
                          valida.descricao.mensagem.map(mens => <small key={mens} id="descricao" className={styles.small}>{mens}</small>)
                        }
                      </div>
                    </div>

                  </div>
                </div>
              </form>

              <div className={styles.situacaoButtons}>
                {situacaoOptions.map(status => (
                  <div
                    key={status.value}
                    className={`${styles.situacao} ${filtroSituacao === status.value ? styles.active : ''}`}
                    onClick={() => setFiltroSituacao(status.value)}
                  >
                    <Image
                      src={`/${status.value.replace(/\s+/g, '_')}.png`}
                      alt={status.label}
                      width={512}
                      height={512}
                      className={styles.icon}
                    />
                    <p className={styles.textIcon}>{status.label}</p>
                  </div>
                ))}
              </div>

              <div className={styles.container}>
                <div className={styles.alinhamento}>
                  {tarefasFiltradas.length === 0 ? (
                    <h1>Nenhuma tarefa encontrada. Selecione um filtro.</h1>
                  ) : (
                    tarefasFiltradas.map(tarefa => (
                      <div className={styles.Item} key={tarefa.id}>
                        <div className={styles.bookInfo}>
                          <div>
                            <button onClick={() => deletaTarefas(tarefa.id)} className={styles.excluirTarefa}>X</button>
                            <h2 className={styles.Title}>{tarefa.titulo}</h2>
                          </div>
                          <p className={styles.Description}>{tarefa.descricao}</p>
                          <button onClick={() => confirmarTarefa(tarefa.id)} className={styles.confirmarTarefa}>Concluir</button>
                          {/* <button onClick={() => handleEdit(tarefa.id)} className={styles.editarTarefa}>Editar</button> */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}