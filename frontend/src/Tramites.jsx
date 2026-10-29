import React, { useEffect, useState } from 'react';const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export default function Tramites() {
  const [token, setToken] = useState('');
  const [estatus, setEstatus] = useState('');
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState({ filas: [], total: 0, pagina: 1, porPagina: 10 });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) { setDatos({ filas: [], total: 0, pagina: 1, porPagina: 10 }); return; }
    const ctrl = new AbortController();
    async function cargar() {
      setCargando(true); setError('');
      try {
        const qs = new URLSearchParams({ pagina:String(pagina), porPagina:'10' });
        if (estatus) qs.set('estatus',estatus);
        const res = await fetch(`${API}/api/tramites?${qs}`, {
          headers: { Authorization:`Bearer ${token}` }, signal:ctrl.signal
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'No fue posible obtener los trámites');
        setDatos(json);
      } catch (e) { if (e.name !== 'AbortError') setError(e.message); }
      finally { if (!ctrl.signal.aborted) setCargando(false); }
    }
    cargar();
    return () => ctrl.abort();
  }, [estatus, pagina, token]);
  const totalPaginas = Math.max(1,Math.ceil(datos.total/datos.porPagina));
  return <main>
    <h1>Trámites de clientes</h1>
    <label>JWT de prueba <input type="password" value={token} onChange={e => { setToken(e.target.value); setPagina(1); }} placeholder="Pega tu token JWT"/></label>
    <label>Filtrar por estatus <select value={estatus} onChange={e => { setEstatus(e.target.value); setPagina(1); }}>
      <option value="">Todos</option><option value="PENDIENTE">Pendiente</option>
      <option value="EN_PROCESO">En proceso</option><option value="CANCELADO">Cancelado</option><option value="CONCLUIDO">Concluido</option>
    </select></label>
    {!token && <p>Introduce un token válido para consultar trámites.</p>}
    {cargando && <p role="status">Cargando trámites...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!cargando && !error && token && <>
      <table><thead><tr><th>ID</th><th>CURP</th><th>Tipo</th><th>Estatus</th><th>Monto</th><th>Empleado</th></tr></thead>
      <tbody>{datos.filas.map(t => <tr key={t.id}><td>{t.id}</td><td>{t.curp}</td><td>{t.tipo}</td><td>{t.estatus}</td><td>{t.monto ?? '—'}</td><td>{t.empleado_id}</td></tr>)}</tbody></table>
      {datos.filas.length === 0 && <p>No hay trámites para el filtro seleccionado.</p>}
      <p>Total: {datos.total} · Página {pagina} de {totalPaginas}</p>
      <nav><button disabled={pagina <= 1} onClick={() => setPagina(p => p-1)}>Anterior</button>
      <button disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p+1)}>Siguiente</button></nav>
    </>}
  </main>;
}
