
import PerfilEditar from '../../perfilEditar/page';

export default async function UsuCod({ params }) {
    const { cod } = await params;
    const codUsu = parseInt(cod);

    return (
        <PerfilEditar codUsu={codUsu} />
    );
}
