/**
 * Componente Principal da Aplicação
 * 
 * Define as rotas e estrutura geral da aplicação
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NovaSolicitacao from './pages/NovaSolicitacao';
import MinhasSolicitacoes from './pages/MinhasSolicitacoes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota raiz redireciona para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas protegidas (requerem autenticação) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/nova-solicitacao"
            element={
              <PrivateRoute>
                <NovaSolicitacao />
              </PrivateRoute>
            }
          />
          <Route
            path="/minhas-solicitacoes"
            element={
              <PrivateRoute>
                <MinhasSolicitacoes />
              </PrivateRoute>
            }
          />
          
          {/* Rota 404 - Página não encontrada */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
