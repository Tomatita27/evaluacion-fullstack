jest.mock('../src/models/tramites.model');
const model = require('../src/models/tramites.model');
const service = require('../src/services/tramites.service');
beforeEach(() => jest.resetAllMocks());
test('rechaza con 409 un trámite cancelado', async () => {
  model.actualizarSiAbierto.mockResolvedValue(null);
  model.buscarPorId.mockResolvedValue({id:1,estatus:'CANCELADO'});
  await expect(service.cambiarEstatus('1','CONCLUIDO')).rejects.toMatchObject({status:409});
});
test('rechaza con 409 un trámite concluido', async () => {
  model.actualizarSiAbierto.mockResolvedValue(null);
  model.buscarPorId.mockResolvedValue({id:2,estatus:'CONCLUIDO'});
  await expect(service.cambiarEstatus('2','PENDIENTE')).rejects.toMatchObject({status:409});
});
test('devuelve 404 si el trámite no existe', async () => {
  model.actualizarSiAbierto.mockResolvedValue(null);
  model.buscarPorId.mockResolvedValue(null);
  await expect(service.cambiarEstatus('99','CONCLUIDO')).rejects.toMatchObject({status:404});
});
test('actualiza un trámite abierto', async () => {
  model.actualizarSiAbierto.mockResolvedValue({id:3,estatus:'CONCLUIDO'});
  await expect(service.cambiarEstatus('3','CONCLUIDO')).resolves.toMatchObject({estatus:'CONCLUIDO'});
});
