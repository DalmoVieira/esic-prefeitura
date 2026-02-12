/**
 * Componente de Layout
 * 
 * Define o layout padrão da aplicação com header e navegação
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Título */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <span className="text-xl font-bold">E-SIC</span>
            </Link>

            {/* Navegação */}
            {user && (
              <nav className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="hover:text-primary-200 transition"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/nova-solicitacao" 
                  className="hover:text-primary-200 transition"
                >
                  Nova Solicitação
                </Link>
                <Link 
                  to="/minhas-solicitacoes" 
                  className="hover:text-primary-200 transition"
                >
                  Minhas Solicitações
                </Link>
                
                {/* Informações do Usuário */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-primary-500">
                  <span className="text-sm">{user.nome}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded transition"
                  >
                    Sair
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 E-SIC - Sistema de Informação ao Cidadão</p>
          <p className="text-sm text-gray-400 mt-2">
            Lei de Acesso à Informação (LAI) - Lei nº 12.527/2011
          </p>
        </div>
      </footer>
    </div>
  );
}
