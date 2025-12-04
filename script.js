// --- DADOS E ESTADO DA APLICAÇÃO ---
        let dados = {
            'p1': {
                nome: 'Maria Silva',
                sinaisVitais: [{ id: 1, pressao: '12/8', cardiaco: '75', oxigenacao: '98', data: new Date() }],
                medicamentos: [{ id: 1, nome: 'Losartana', dosagem: '50mg', hora: '08:00' }],
                consultas: [{ id: 1, especialidade: 'Cardiologista', data: '2025-10-15', hora: '10:30' }],
                diario: [{ id: 1, data: new Date(), atividades: 'Assisti TV e li um livro.', dorNivel: 2, dorLocal: 'Costas', sono: 'Boa', refeicoes: 'Comi bem no almoço.', emocional: 'Calmo(a)', fisica: 'Caminhada leve no quintal.' }]
            }
        };
        let pacienteAtualId = 'p1';
        let chatHistory = [];

        // --- FUNÇÕES DE RENDERIZAÇÃO GERAL ---
        function renderizarTudo() {
            if (!dados[pacienteAtualId]) {
                const idsDisponiveis = Object.keys(dados);
                if (idsDisponiveis.length > 0) {
                    pacienteAtualId = idsDisponiveis[0];
                } else {
                    document.getElementById('nome-paciente-atual').textContent = "Nenhum Paciente";
                    ['lista-sinais-vitais', 'lista-medicamentos', 'lista-consultas', 'lista-diario'].forEach(id => document.getElementById(id).innerHTML = '');
                    return;
                }
            }
            document.getElementById('nome-paciente-atual').textContent = dados[pacienteAtualId].nome;
            renderizarSinaisVitais();
            renderizarMedicamentos();
            renderizarConsultas();
            renderizarDiario();
            document.getElementById('resultado-ia-container').classList.add('hidden');
            lucide.createIcons();
        }

        function renderizarSinaisVitais() {
            const listaEl = document.getElementById('lista-sinais-vitais');
            const dadosPaciente = dados[pacienteAtualId].sinaisVitais;
            listaEl.innerHTML = '';
            if (dadosPaciente.length === 0) { listaEl.innerHTML = `<p class="text-gray-500 text-center p-4">Nenhum registro encontrado.</p>`; return; }
            [...dadosPaciente].sort((a, b) => b.data - a.data).forEach(item => {
                const dataFormatada = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.data));
                listaEl.innerHTML += `<div class="bg-gray-100 p-3 rounded-lg flex justify-between items-center"><div><p class="font-semibold">PA: ${item.pressao} | FC: ${item.cardiaco}bpm | SpO₂: ${item.oxigenacao}%</p><p class="text-sm text-gray-500">${dataFormatada}</p></div><button onclick="removerItem('sinaisVitais', ${item.id})" class="text-gray-400 hover:text-red-500 transition"><i data-lucide="trash-2" class="w-5 h-5"></i></button></div>`;
            });
            lucide.createIcons();
        }
        function renderizarMedicamentos() {
            const listaEl = document.getElementById('lista-medicamentos');
            const dadosPaciente = dados[pacienteAtualId].medicamentos;
            listaEl.innerHTML = '';
            if (dadosPaciente.length === 0) { listaEl.innerHTML = `<p class="text-gray-500 text-center p-4">Nenhum lembrete encontrado.</p>`; return; }
            [...dadosPaciente].sort((a, b) => a.hora.localeCompare(b.hora)).forEach(item => {
                listaEl.innerHTML += `<div class="bg-gray-100 p-3 rounded-lg flex justify-between items-center"><div><p class="font-semibold">${item.nome} (${item.dosagem})</p><p class="text-sm text-gray-500">Horário: ${item.hora}</p></div><button onclick="removerItem('medicamentos', ${item.id})" class="text-gray-400 hover:text-red-500 transition"><i data-lucide="trash-2" class="w-5 h-5"></i></button></div>`;
            });
            lucide.createIcons();
        }
        function renderizarConsultas() {
            const listaEl = document.getElementById('lista-consultas');
            const dadosPaciente = dados[pacienteAtualId].consultas;
            listaEl.innerHTML = '';
            if (dadosPaciente.length === 0) { listaEl.innerHTML = `<p class="text-gray-500 text-center p-4">Nenhuma consulta agendada.</p>`; return; }
            [...dadosPaciente].sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`)).forEach(item => {
                const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(new Date(`${item.data}T00:00:00`));
                listaEl.innerHTML += `<div class="bg-gray-100 p-3 rounded-lg flex justify-between items-center"><div><p class="font-semibold">${item.especialidade}</p><p class="text-sm text-gray-500">Data: ${dataFormatada} às ${item.hora}</p></div><button onclick="removerItem('consultas', ${item.id})" class="text-gray-400 hover:text-red-500 transition"><i data-lucide="trash-2" class="w-5 h-5"></i></button></div>`;
            });
            lucide.createIcons();
        }
        function renderizarDiario() {
            const listaEl = document.getElementById('lista-diario');
            const dadosPaciente = dados[pacienteAtualId].diario;
            listaEl.innerHTML = '';
            if (dadosPaciente.length === 0) { listaEl.innerHTML = `<p class="text-gray-500 text-center p-4">Nenhum registro no diário.</p>`; return; }
            [...dadosPaciente].sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(item => {
                const dataFormatada = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(item.data));
                listaEl.innerHTML += `<div class="bg-gray-100 p-4 rounded-lg relative"><button onclick="removerItem('diario', ${item.id})" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"><i data-lucide="x" class="w-5 h-5"></i></button><p class="font-semibold text-md mb-3">${dataFormatada}</p><div class="space-y-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4"><p><strong>Humor:</strong> ${item.emocional || 'N/A'}</p><p><strong>Sono:</strong> ${item.sono || 'N/A'}</p><p class="sm:col-span-2"><strong>Dor:</strong> Nível ${item.dorNivel}/10 ${item.dorLocal ? `em ${item.dorLocal}`: ''}</p><p class="sm:col-span-2"><strong>Atividade Física:</strong> ${item.fisica || 'Nenhuma'}</p><p class="sm:col-span-2"><strong>Apetite/Refeições:</strong> ${item.refeicoes || 'N/A'}</p><p class="sm:col-span-2"><strong>Atividades do Dia:</strong> ${item.atividades || 'N/A'}</p></div></div>`;
            });
            lucide.createIcons();
        }

        // --- LÓGICA DE EVENTOS (Formulários) ---
        document.getElementById('form-sinais-vitais').addEventListener('submit', function(e) { e.preventDefault(); dados[pacienteAtualId].sinaisVitais.push({ id: Date.now(), pressao: e.target.pressao.value, cardiaco: e.target.cardiaco.value, oxigenacao: e.target.oxigenacao.value, data: new Date() }); renderizarSinaisVitais(); e.target.reset(); });
        document.getElementById('form-medicamentos').addEventListener('submit', function(e) { e.preventDefault(); dados[pacienteAtualId].medicamentos.push({ id: Date.now(), nome: e.target['nome-medicamento'].value, dosagem: e.target['dosagem-medicamento'].value, hora: e.target['hora-medicamento'].value }); renderizarMedicamentos(); e.target.reset(); });
        document.getElementById('form-consultas').addEventListener('submit', function(e) { e.preventDefault(); dados[pacienteAtualId].consultas.push({ id: Date.now(), especialidade: e.target['especialidade-consulta'].value, data: e.target['data-consulta'].value, hora: e.target['hora-consulta'].value }); renderizarConsultas(); e.target.reset(); });
        document.getElementById('form-diario').addEventListener('submit', function(e) { e.preventDefault(); dados[pacienteAtualId].diario.push({ id: Date.now(), data: new Date(), atividades: e.target['atividades-diarias'].value, dorNivel: e.target['nivel-dor'].value, dorLocal: e.target['local-dor'].value, sono: e.target['qualidade-sono'].value, refeicoes: e.target['apetite-refeicoes'].value, emocional: e.target['bem-estar-emocional'].value, fisica: e.target['atividade-fisica'].value }); renderizarDiario(); e.target.reset(); document.getElementById('valor-dor').textContent = '0'; });
        function removerItem(tipo, id) { dados[pacienteAtualId][tipo] = dados[pacienteAtualId][tipo].filter(item => item.id !== id); renderizarTudo(); }
        
        // --- MODAL DE ALERTA ---
        const modalAlerta = document.getElementById('modal-alerta');
        function mostrarModalAlerta() { modalAlerta.classList.remove('hidden'); setTimeout(() => modalAlerta.querySelector('div').classList.remove('scale-95'), 50); }
        function fecharModalAlerta() { modalAlerta.querySelector('div').classList.add('scale-95'); setTimeout(() => modalAlerta.classList.add('hidden'), 200); }

        // --- GESTÃO DE PACIENTES ---
        const modalPacientes = document.getElementById('modal-pacientes');
        function mostrarModalPacientes() { renderizarListaPacientes(); modalPacientes.classList.remove('hidden'); setTimeout(() => modalPacientes.querySelector('div:first-child').classList.remove('scale-95'), 50); }
        function fecharModalPacientes() { modalPacientes.querySelector('div:first-child').classList.add('scale-95'); setTimeout(() => modalPacientes.classList.add('hidden'), 200); }
        
        function renderizarListaPacientes() {
            const listaEl = document.getElementById('lista-pacientes');
            listaEl.innerHTML = '';
            Object.keys(dados).forEach(id => {
                const paciente = dados[id];
                const isAtual = id === pacienteAtualId;
                listaEl.innerHTML += `
                    <div class="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                        <span class="font-semibold ${isAtual ? 'text-blue-600' : ''}">${paciente.nome}</span>
                        <div class="flex gap-2">
                            <button onclick="selecionarPaciente('${id}')" class="text-sm bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition" ${isAtual ? 'disabled' : ''}>${isAtual ? 'Selecionado' : 'Selecionar'}</button>
                            <button onclick="removerPaciente('${id}')" class="text-sm bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition" ${isAtual && Object.keys(dados).length === 1 ? 'disabled' : ''}><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>
                    </div>`;
            });
            lucide.createIcons();
        }

        document.getElementById('form-add-paciente').addEventListener('submit', (e) => {
            e.preventDefault();
            const inputNome = document.getElementById('novo-nome-paciente');
            const nome = inputNome.value.trim();
            if (nome) {
                const novoId = 'p' + Date.now();
                dados[novoId] = { nome: nome, sinaisVitais: [], medicamentos: [], consultas: [], diario: [] };
                inputNome.value = '';
                renderizarListaPacientes();
            }
        });

        function selecionarPaciente(id) {
            pacienteAtualId = id;
            renderizarTudo();
            fecharModalPacientes();
        }

        function removerPaciente(id) {
            if (Object.keys(dados).length > 1) {
                if (confirm(`Tem certeza que deseja remover ${dados[id].nome} e todos os seus dados?`)) {
                    delete dados[id];
                    if (id === pacienteAtualId) {
                        pacienteAtualId = Object.keys(dados)[0];
                    }
                    renderizarTudo();
                    renderizarListaPacientes();
                }
            } else {
                alert("Não é possível remover o único paciente.");
            }
        }

        // --- LÓGICA DA IA ---
        const apiKey = "AIzaSyBHLgPIvFxrD5lbIx0hCmj8R3SL-OqIUeI"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-05-20:generateContent?key=${apiKey}`;
        const resultadoIAEl = document.getElementById('resultado-ia');
        const resultadoContainerEl = document.getElementById('resultado-ia-container');
        const chatContainerEl = document.getElementById('chat-container');
        const btnAnaliseEl = document.getElementById('btn-analise-ia');

        const systemPrompt = "Você é um assistente de bem-estar virtual chamado 'Aura'. Sua função é analisar o diário de um idoso e oferecer sugestões gentis e motivacionais para melhorar seu dia. É absolutamente proibido dar conselhos médicos, diagnósticos ou prescrever qualquer tratamento. Suas sugestões devem focar em atividades leves e seguras, como: relaxamento (ouvir música, respiração profunda), conforto (tomar um chá quente), atividades prazerosas (ler, conversar com um amigo) e movimento leve (se apropriado, como uma caminhada curta). Sempre termine suas respostas com a frase: 'Lembre-se, sou apenas um assistente virtual para bem-estar. Para qualquer questão de saúde, por favor, consulte seu médico.' Use uma linguagem extremamente simples, positiva e encorajadora.";

        async function chamarGeminiAPI(historico) {
            const payload = { contents: historico, systemInstruction: { parts: [{ text: systemPrompt }] } };
            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                const result = await response.json();
                return result.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui gerar uma resposta no momento.";
            } catch (error) {
                console.error("Erro ao chamar a API:", error);
                return "Ocorreu um erro ao tentar obter a análise. Por favor, tente novamente mais tarde.";
            }
        }

        async function gerarAnaliseIA() {
            const diarioPaciente = dados[pacienteAtualId].diario;
            if (diarioPaciente.length === 0) { alert("Por favor, adicione pelo menos um registro no diário antes de gerar uma análise."); return; }
            btnAnaliseEl.disabled = true;
            btnAnaliseEl.innerHTML = `<i data-lucide="loader-circle" class="w-5 h-5 animate-spin"></i> Analisando...`;
            lucide.createIcons();
            
            const ultimoRegistro = [...diarioPaciente].sort((a, b) => new Date(b.data) - new Date(a.data))[0];
            const promptUsuario = `Analise este registro do meu diário e me dê algumas sugestões gentis de bem-estar:\n- Humor: ${ultimoRegistro.emocional}\n- Sono: ${ultimoRegistro.sono}\n- Dor: Nível ${ultimoRegistro.dorNivel}/10 em '${ultimoRegistro.dorLocal}'\n- Atividade Física: ${ultimoRegistro.fisica}\n- Refeições: ${ultimoRegistro.refeicoes}\n- Atividades do Dia: ${ultimoRegistro.atividades}`;
            
            chatHistory = [{ role: "user", parts: [{ text: promptUsuario }] }];
            const resposta = await chamarGeminiAPI(chatHistory);
            chatHistory.push({ role: "model", parts: [{ text: resposta }] });

            resultadoIAEl.textContent = resposta;
            resultadoContainerEl.classList.remove('hidden');
            chatContainerEl.innerHTML = ''; 

            btnAnaliseEl.disabled = false;
            btnAnaliseEl.innerHTML = `<i data-lucide="wand-2" class="w-5 h-5"></i> Gerar Análise do Último Registro`;
            lucide.createIcons();
        }

        document.getElementById('form-chat').addEventListener('submit', async function(e) {
            e.preventDefault();
            const inputEl = document.getElementById('chat-input');
            const mensagemUsuario = inputEl.value.trim();
            if (!mensagemUsuario) return;
            adicionarMensagemAoChat(mensagemUsuario, 'user');
            chatHistory.push({ role: "user", parts: [{ text: mensagemUsuario }] });
            inputEl.value = '';
            const respostaIA = await chamarGeminiAPI(chatHistory);
            chatHistory.push({ role: "model", parts: [{ text: respostaIA }] });
            adicionarMensagemAoChat(respostaIA, 'ai');
        });

        function adicionarMensagemAoChat(texto, autor) {
            const div = document.createElement('div');
            div.className = `chat-bubble chat-${autor}`;
            div.textContent = texto;
            chatContainerEl.appendChild(div);
            chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
        }

        // --- INICIALIZAÇÃO DA APLICAÇÃO ---
        document.addEventListener('DOMContentLoaded', () => {
            renderizarTudo();
            document.getElementById('nivel-dor').addEventListener('input', (e) => {
                document.getElementById('valor-dor').textContent = e.target.value;
            });
        });

    


