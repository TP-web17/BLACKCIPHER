# Deploy no Railway

1. Envie todos os arquivos desta pasta para um novo projeto no Railway.
2. O Railway vai detectar automaticamente o app Node por causa do `package.json`.
3. Crie um `Volume` no service e monte em `/data`.
4. Adicione a variavel `DATA_DIR=/data`.
5. O comando de start ja esta pronto: `node server.js`.
6. Depois do deploy, abra `/api/health` para confirmar que `railwayVolumeMounted` ou `dataPath` estao apontando para o volume correto.

## O que ja ficou pronto

- Login e registro centralizados no servidor.
- Sessao por cookie com auto-login quando a pessoa volta ao site.
- Conversas, mensagens, perfis e log sincronizados entre dispositivos.
- Persistencia em arquivo JSON no volume do Railway.
- Endpoint de saude em `/api/health`.

## Estrutura importante

- Cliente principal: `app.js`
- Servidor: `server.js`
- Entrada do site: `index.html`
- Persistencia local para desenvolvimento: `data/`
