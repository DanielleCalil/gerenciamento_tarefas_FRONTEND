// Importando o componente de edição de perfil
import PerfilEditar from '../../perfilEditar/page';

// Definindo o componente UsuCod que recebe os parâmetros da URL
export default async function UsuCod({ params }) {
    // Aguardando a resolução do valor de params.cod
    const { cod } = await params; // Acessando os parâmetros de forma assíncrona
    const codUsu = parseInt(cod); // Convertendo o parâmetro para um número inteiro

    return (
        // Passando o valor de codUsu como prop para o componente PerfilEditar
        <PerfilEditar codUsu={codUsu} />
    );
}
