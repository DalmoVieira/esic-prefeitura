/**
 * Página Dashboard
 * 
 * Página inicial após login, mostra resumo das solicitações
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    emAnalise: 0,
    respondidas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/solicitacoes');
      const solicitacoes = response.data.solicitacoes;

      // Calcula estatísticas
      const stats = {
        total: solicitacoes.length,
        pendentes: solicitacoes.filter(s => s.status === 'pendente').length,
        emAnalise: solicitacoes.filter(s => s.status === 'em_analise').length,
        respondidas: solicitacoes.filter(s => s.status === 'respondida').length
      };

      setStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Boas-vindas */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user?.nome}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao Sistema E-SIC. Aqui você pode fazer solicitações de informação 
          e acompanhar o andamento de suas solicitações.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <svg 
                className="w-6 h-6 text-primary-600" 
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
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <svg 
                className="w-6 h-6 text-yellow-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.pendentes}
              </p>
            </div>
          </div>
        </div>

        {/* Em Análise */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Em Análise</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.emAnalise}
              </p>
            </div>
          </div>
        </div>

        {/* Respondidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg 
                className="w-6 h-6 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Respondidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.respondidas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/nova-solicitacao"
            className="flex items-center p-4 border-2 border-primary-200 rounded-lg hover:bg-primary-50 transition group"
          >
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3 group-hover:bg-primary-200">
              <svg 
                className="w-6 h-6 text-primary-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900">Nova Solicitação</p>
              <p className="text-sm text-gray-600">Faça uma nova solicitação de informação</p>
            </div>
          </Link>

          <Link
            to="/minhas-solicitacoes"
            className="flex items-center p-4 border-2 border-primary-200 rounded-lg hover:bg-primary-50 transition group"
          >
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3 group-hover:bg-primary-200">
              <svg 
                className="w-6 h-6 text-primary-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900">Minhas Solicitações</p>
              <p className="text-sm text-gray-600">Veja e acompanhe suas solicitações</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Informações sobre a LAI */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Sobre a Lei de Acesso à Informação (LAI)
        </h3>
        <p className="text-blue-800">
          A LAI (Lei nº 12.527/2011) garante o direito de acesso às informações públicas. 
          As solicitações devem ser respondidas em até 20 dias, prorrogáveis por mais 10 dias.
        </p>
      </div>
    </Layout>
  );
}
