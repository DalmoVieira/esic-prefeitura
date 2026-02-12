/**
 * Página Minhas Solicitações
 * 
 * Lista todas as solicitações do usuário
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const location = useLocation();

  useEffect(() => {
    loadSolicitacoes();
  }, []);

  const loadSolicitacoes = async () => {
    try {
      const response = await api.get('/solicitacoes');
      setSolicitacoes(response.data.solicitacoes);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      em_analise: 'bg-blue-100 text-blue-800 border-blue-200',
      respondida: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      pendente: 'Pendente',
      em_analise: 'Em Análise',
      respondida: 'Respondida'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe o status de todas as suas solicitações
          </p>
        </div>

        {/* Mensagem de Sucesso */}
        {location.state?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {location.state.message}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando solicitações...</p>
          </div>
        ) : solicitacoes.length === 0 ? (
          /* Nenhuma Solicitação */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Você ainda não criou nenhuma solicitação
            </p>
            <a
              href="/nova-solicitacao"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Criar Primeira Solicitação
            </a>
          </div>
        ) : (
          /* Lista de Solicitações */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prazo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitacoes.map((solicitacao) => (
                    <tr key={solicitacao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {solicitacao.protocolo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{solicitacao.categoria}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(solicitacao.status)}`}>
                          {getStatusText(solicitacao.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(solicitacao.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(solicitacao.prazoResposta)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedSolicitacao(solicitacao)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedSolicitacao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header do Modal */}
              <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Detalhes da Solicitação</h3>
                <button
                  onClick={() => setSelectedSolicitacao(null)}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedSolicitacao.protocolo}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <p className="text-gray-900">{selectedSolicitacao.categoria}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(selectedSolicitacao.status)}`}>
                      {getStatusText(selectedSolicitacao.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Criação</label>
                    <p className="text-gray-900">{formatDate(selectedSolicitacao.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Resposta</label>
                    <p className="text-gray-900">{formatDate(selectedSolicitacao.prazoResposta)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Recebimento</label>
                  <p className="text-gray-900">
                    {selectedSolicitacao.formaRecebimento === 'portal' ? 'Pelo sistema' : 'Por email'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">
                    {selectedSolicitacao.descricao}
                  </p>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setSelectedSolicitacao(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
