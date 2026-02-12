/**
 * Página Nova Solicitação
 * 
 * Formulário para criar uma nova solicitação de informação
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function NovaSolicitacao() {
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    formaRecebimento: 'portal'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categorias = [
    'Saúde',
    'Educação',
    'Infraestrutura',
    'Transporte',
    'Meio Ambiente',
    'Segurança',
    'Administração',
    'Finanças',
    'Obras',
    'Outros'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação
    if (!formData.categoria || !formData.descricao) {
      setError('Por favor, preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (formData.descricao.length < 20) {
      setError('A descrição deve ter pelo menos 20 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/solicitacoes', formData);
      const protocolo = response.data.solicitacao.protocolo;

      // Redireciona para a página de sucesso com o protocolo
      navigate('/minhas-solicitacoes', {
        state: { 
          success: true,
          message: `Solicitação criada com sucesso! Protocolo: ${protocolo}`
        }
      });
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar solicitação';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nova Solicitação</h1>
          <p className="text-gray-600 mt-2">
            Faça uma solicitação de informação com base na Lei de Acesso à Informação (LAI)
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Escolha a categoria que melhor descreve sua solicitação
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da Solicitação *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descreva detalhadamente a informação que você está solicitando..."
                disabled={loading}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Mínimo de 20 caracteres. Seja claro e específico sobre a informação desejada.
              </p>
            </div>

            {/* Forma de Recebimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Recebimento da Resposta *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="formaRecebimento"
                    value="portal"
                    checked={formData.formaRecebimento === 'portal'}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-gray-700">Pelo sistema (recomendado)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="formaRecebimento"
                    value="email"
                    checked={formData.formaRecebimento === 'email'}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-gray-700">Por email</span>
                </label>
              </div>
            </div>

            {/* Informações sobre Prazo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                📋 Informações Importantes
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Prazo de resposta: até 20 dias úteis</li>
                <li>• Você receberá um número de protocolo para acompanhamento</li>
                <li>• Seja claro e específico em sua solicitação</li>
                <li>• Não solicite informações pessoais de terceiros</li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
