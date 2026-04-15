import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, TrendingUp, Users, Clock, CheckCircle, Search, FileText } from 'lucide-react';

const POPULAR_TOPICS = [
  'Concursos Públicos',
  'Gastos com COVID-19',
  'Obras Viárias',
  'Saúde',
  'Educação',
  'Contratos e Licitações',
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Transparency: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (term: string) => {
    setSearching(true);
    setSearched(true);
    try {
      const url = `${API_BASE}/public/requests${term ? `?q=${encodeURIComponent(term)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce: busca 500ms após o usuário parar de digitar
  useEffect(() => {
    if (!searchTerm && !searched) return;
    const t = setTimeout(() => doSearch(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm, doSearch]);

  const handleChipClick = (topic: string) => {
    setSearchTerm(topic);
    doSearch(topic);
  };
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Painel de Transparência Ativa</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Consulte estatísticas e dados consolidados sobre o cumprimento da Lei de Acesso à Informação em nosso município.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '4rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp color="var(--primary)" />
            Volume de Pedidos (2026)
          </h3>
          <div style={{ height: '200px', backgroundColor: '#f9f9f9', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem' }}>
            <div style={{ width: '30px', height: '40%', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ width: '30px', height: '60%', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ width: '30px', height: '85%', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ width: '30px', height: '20%', backgroundColor: '#eee', borderRadius: '4px 4px 0 0' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle color="var(--success)" />
            Status das Respostas
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
             {/* Mocking a pie chart with CSS */}
             <div style={{ 
               width: '150px', 
               height: '150px', 
               borderRadius: '50%', 
               background: 'conic-gradient(var(--success) 0% 75%, var(--warning) 75% 90%, var(--danger) 90% 100%)',
               position: 'relative'
             }}>
               <div style={{ 
                 position: 'absolute', 
                 top: '50%', 
                 left: '50%', 
                 transform: 'translate(-50%, -50%)', 
                 width: '90px', 
                 height: '90px', 
                 backgroundColor: 'white', 
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontWeight: 'bold',
                 fontSize: '1.2rem'
               }}>
                 92%
               </div>
             </div>
          </div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'var(--success)' }}></div> Respondidos</span>
              <strong>342</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'var(--warning)' }}></div> Em análise</span>
              <strong>28</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'var(--danger)' }}></div> Indeferidos</span>
              <strong>12</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Clock size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h4>Tempo Médio</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>12 dias</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prazo legal: 20 dias</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h4>Usuários Ativos</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,248</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cidadãos cadastrados</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <BarChart size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h4>Índice de Recurso</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>4.2%</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Solicitações recorridas</p>
        </div>
      </div>

      <section style={{ backgroundColor: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '2rem' }}>Busca de Respostas Públicas</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Pesquise na base de conhecimento por pedidos já respondidos. As informações pessoais dos solicitantes são preservadas conforme a LGPD.
        </p>
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: 'Contratos merenda escolar', 'Folha de pagamento'..."
            style={{ padding: '1rem 1rem 1rem 3rem', fontSize: '1.1rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search size={24} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem' }}>Assuntos mais pesquisados</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {POPULAR_TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => handleChipClick(topic)}
                style={{
                  backgroundColor: searchTerm === topic ? 'var(--primary)' : '#eee',
                  color: searchTerm === topic ? '#fff' : 'var(--text-main)',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {topic}
              </button>
            ))}
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setResults([]); setSearched(false); }}
                style={{ backgroundColor: 'transparent', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', border: '1px solid var(--danger)', cursor: 'pointer' }}
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Resultados */}
        {searching && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Buscando...</div>
        )}

        {!searching && searched && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {results.length === 0
                ? 'Nenhum resultado encontrado.'
                : `${results.length} resultado${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''}.`}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.map(req => (
                <div key={req.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} color="var(--primary)" />
                      <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>{req.protocol}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {req.department?.name && <span>{req.department.name}</span>}
                      <span>{new Date(req.openingDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <strong>Pergunta:</strong> {req.description}
                  </p>
                  {req.response && (
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', backgroundColor: '#f6ffed', padding: '0.75rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--success)' }}>
                      <strong>Resposta:</strong> {req.response}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Transparency;
