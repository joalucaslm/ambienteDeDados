// --- test-connection.js ---
// Cole este código no console do navegador para verificar a conexão com o backend.

(async function testBackendConnection() {
    console.log('Iniciando verificação de saúde do backend...');

    const endpoints = [
        'http://localhost:3000/restaurantes',
        'http://localhost:3000/api/status' // Assumindo que esta rota existe ou pode ser criada.
    ];

    for (const url of endpoints) {
        console.log(`%cTestando endpoint: ${url}`, 'font-weight: bold;');
        try {
            const response = await fetch(url);
            
            if (response.ok) {
                console.log(`%cSUCESSO: A conexão com ${url} foi bem-sucedida.`, 'color: green;');
                const data = await response.json().catch(() => 'Resposta não é JSON ou está vazia.');
                console.log('Dados recebidos:', data);
            } else {
                console.error(`%cERRO: O servidor respondeu, mas com um status de erro.`, 'color: orange;');
                console.error(`Status: ${response.status} - ${response.statusText}`);
            }

        } catch (error) {
            console.error(`%cERRO GRAVE: Não foi possível conectar a ${url}.`, 'color: red;');
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                console.error('Causa provável:');
                console.error('1. O servidor backend não está rodando (execute `node index.js` ou similar).');
                console.error('2. Erro de CORS. O backend precisa permitir requisições do seu frontend.');
                console.error('   Verifique se `app.use(cors())` está configurado no seu `index.js` do Node.js.');
            } else {
                console.error('Erro detalhado:', error);
            }
        }
        console.log('---');
    }
    console.log('Verificação de saúde concluída.');
})();
