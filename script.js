 let currentStep = 1;
        let currentGenre = 'samba';
        let isPlaying = false;
        let progress = 0;
        let progressInterval;
        let currentPose = 'neutral';
        let dancerIdCounter = 0;
        let stageDancers = [];

        // Menu lateral
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const overlay = document.getElementById('overlay');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('shifted');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mainContent.classList.remove('shifted');
            overlay.classList.remove('active');
        });

        // Stage Functions - Adicionado do código secundário
        function openStage() {
            document.getElementById('stageModal').classList.add('active');
            overlay.classList.add('active');
            sidebar.classList.remove('open');
            mainContent.classList.remove('shifted');
        }

        function closeStage() {
            document.getElementById('stageModal').classList.remove('active');
            overlay.classList.remove('active');
        }

        // Drag and Drop Functions - Adicionado do código secundário
        function dragStart(event) {
            const color = event.target.closest('.dancer-item').dataset.color;
            event.dataTransfer.setData('color', color);
            event.dataTransfer.effectAllowed = 'copy';
        }

        function allowDrop(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }

        function drop(event) {
            event.preventDefault();
            const color = event.dataTransfer.getData('color');
            const stageContainer = document.getElementById('stageContainer');
            const rect = stageContainer.getBoundingClientRect();

            const x = event.clientX - rect.left - 25;
            const y = event.clientY - rect.top - 35;

            createDancerOnStage(x, y, color);
        }

        function createDancerOnStage(x, y, color) {
            const dancer = document.createElement('div');
            dancer.className = 'stage-dancer';
            dancer.id = 'dancer-' + dancerIdCounter++;
            dancer.style.left = x + 'px';
            dancer.style.top = y + 'px';

            dancer.innerHTML = `
        <div class="dancer-delete" onclick="removeDancer('${dancer.id}')">×</div>
        <svg viewBox="0 0 50 70" style="width: 100%; height: 100%;">
            <circle cx="25" cy="10" r="8" fill="${color}"/>
            <line x1="25" y1="18" x2="25" y2="45" stroke="${color}" stroke-width="3"/>
            <line x1="25" y1="25" x2="15" y2="35" stroke="${color}" stroke-width="3"/>
            <line x1="25" y1="25" x2="35" y2="35" stroke="${color}" stroke-width="3"/>
            <line x1="25" y1="45" x2="15" y2="65" stroke="${color}" stroke-width="3"/>
            <line x1="25" y1="45" x2="35" y2="65" stroke="${color}" stroke-width="3"/>
        </svg>
    `;

            dancer.draggable = true;
            dancer.addEventListener('dragstart', function (e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('dancerId', dancer.id);
                dancer.classList.add('dragging');
            });

            dancer.addEventListener('dragend', function () {
                dancer.classList.remove('dragging');
            });

            document.getElementById('stageContainer').appendChild(dancer);
            stageDancers.push({ id: dancer.id, x, y, color });
        }


        // Allow repositioning dancers on stage
        document.getElementById('stageContainer').addEventListener('drop', function (event) {
            event.preventDefault();
            const dancerId = event.dataTransfer.getData('dancerId');

            if (dancerId) {
                const dancer = document.getElementById(dancerId);
                if (dancer) {
                    const stageContainer = document.getElementById('stageContainer');
                    const rect = stageContainer.getBoundingClientRect();

                    const x = event.clientX - rect.left - 25;
                    const y = event.clientY - rect.top - 35;

                    dancer.style.left = x + 'px';
                    dancer.style.top = y + 'px';

                    // Update position in array
                    const dancerData = stageDancers.find(d => d.id === dancerId);
                    if (dancerData) {
                        dancerData.x = x;
                        dancerData.y = y;
                    }
                }
            }
        });

        function removeDancer(dancerId) {
            const dancer = document.getElementById(dancerId);
            if (dancer) {
                dancer.remove();
                stageDancers = stageDancers.filter(d => d.id !== dancerId);
            }
        }

        function clearStage() {
            const dancers = document.querySelectorAll('.stage-dancer');
            dancers.forEach(dancer => dancer.remove());
            stageDancers = [];
        }

        function saveCoreography() {
            if (stageDancers.length === 0) {
                alert('Adicione pelo menos um dançarino ao palco!');
                return;
            }

            const coreography = {
                dancers: stageDancers,
                timestamp: new Date().toISOString()
            };

            const data = JSON.stringify(coreography, null, 2);
            alert('Coreografia salva com sucesso! Total de dançarinos: ' + stageDancers.length);
            console.log('Coreografia salva:', data);
        }

        function animateDancers() {
            const dancers = document.querySelectorAll('.stage-dancer svg');

            if (dancers.length === 0) {
                alert('Adicione dançarinos ao palco primeiro!');
                return;
            }

            dancers.forEach((svg, index) => {
                setTimeout(() => {
                    svg.style.animation = 'dance 1s ease-in-out';
                    setTimeout(() => {
                        svg.style.animation = '';
                    }, 1000);
                }, index * 200);
            });
        }

        // Função para mudar a pose do bonequinho
        function changePose(pose) {
            const figure = document.getElementById('danceFigure');
            const buttons = document.querySelectorAll('.figure-btn');

            // Remove classes ativas
            buttons.forEach(btn => btn.classList.remove('active'));
            figure.classList.remove('bounce', 'sway', 'step');

            // Ativa o botão clicado
            event.target.classList.add('active');

            // Aplica a pose selecionada
            currentPose = pose;

            // Remove todas as transformações anteriores
            figure.querySelectorAll('.arm, .leg').forEach(limb => {
                limb.style.transform = '';
            });

            switch (pose) {
                case 'neutral':
                    // Posição neutra - braços e pernas retos
                    figure.querySelector('.arm.left').style.transform = 'rotate(-30deg)';
                    figure.querySelector('.arm.right').style.transform = 'rotate(30deg)';
                    figure.querySelector('.leg.left').style.transform = 'rotate(0deg)';
                    figure.querySelector('.leg.right').style.transform = 'rotate(0deg)';
                    break;

                case 'rhythm':
                    // Percepção rítmica - balanço suave
                    figure.classList.add('sway');
                    figure.querySelector('.arm.left').style.transform = 'rotate(-45deg)';
                    figure.querySelector('.arm.right').style.transform = 'rotate(45deg)';
                    break;

                case 'weight':
                    // Controle de peso - transferência de peso
                    figure.classList.add('step');
                    figure.querySelector('.leg.left').style.transform = 'rotate(-15deg)';
                    figure.querySelector('.leg.right').style.transform = 'rotate(15deg)';
                    break;

                case 'posture':
                    // Postura - braços mais abertos, pernas firmes
                    figure.querySelector('.arm.left').style.transform = 'rotate(-60deg)';
                    figure.querySelector('.arm.right').style.transform = 'rotate(60deg)';
                    figure.querySelector('.leg.left').style.transform = 'rotate(-5deg)';
                    figure.querySelector('.leg.right').style.transform = 'rotate(5deg)';
                    figure.classList.add('bounce');
                    break;
            }
        }

        function selectStep(step) {
            currentStep = step;

            // Remove active class from all steps
            document.querySelectorAll('.step-card').forEach(card => {
                card.classList.remove('active');
            });

            // Add active class to selected step
            document.querySelectorAll('.step-card')[step - 1].classList.add('active');

            // Atualiza automaticamente a pose do bonequinho baseada no passo selecionado
            const poseMap = {
                1: 'rhythm',    // Percepção Rítmica
                2: 'weight',    // Controle de Peso
                3: 'posture',   // Flexão de Joelhos (relacionado à postura)
                4: 'posture',   // Postura Corporal
                5: 'neutral',   // Consciência Espacial
                6: 'rhythm'     // Coordenação Motora
            };

            changePose(poseMap[step]);

            // Atualiza o botão ativo
            document.querySelectorAll('.figure-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.includes(getPoseName(poseMap[step]))) {
                    btn.classList.add('active');
                }
            });

            // Update instruction
            const instructions = {
                1: "Percepção Rítmica: Feche os olhos e tente identificar a batida principal da música. Conte mentalmente: 1, 2, 3, 4...",
                2: "Controle de Peso: Pratique transferir seu peso suavemente de um pé para o outro, mantendo o equilíbrio.",
                3: "Flexão de Joelhos: Mantenha os joelhos levemente flexionados - isso dá mobilidade e absorve impactos.",
                4: "Postura Corporal: Imagine uma linha reta da orelha até o tornozelo. Mantenha o peito aberto e ombros relaxados.",
                5: "Consciência Espacial: Esteja ciente do espaço ao seu redor. Pratique movimentos sem olhar para os pés.",
                6: "Coordenação Motora: Comece com movimentos simples de braços e pernas, depois combine-os gradualmente."
            };

            document.getElementById('instructionText').textContent = instructions[step];
        }

        // Função auxiliar para obter o nome da pose
        function getPoseName(pose) {
            const poseNames = {
                'neutral': 'Posição Neutra',
                'rhythm': 'Percepção Rítmica',
                'weight': 'Controle de Peso',
                'posture': 'Postura'
            };
            return poseNames[pose] || 'Posição Neutra';
        }

        function selectGenre(genre) {
            currentGenre = genre;

            // Remove active class from all genres
            document.querySelectorAll('.genre-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to selected genre
            event.target.classList.add('active');

            // Update song info based on genre
            const genreData = {
                'samba': {
                    title: 'Samba no Pé - Coreografia',
                    artist: 'FitDance/Cia de Dança',
                    instruction: 'Samba selecionado! Aplique os fundamentos básicos neste ritmo brasileiro.',
                    videoSrc: 'https://www.youtube.com/embed/ZcdAc2eP5ic?si=BkI39mNIyS7jLgw_',
                    tips: [
                        'Mantenha os joelhos levemente flexionados para facilitar o movimento dos quadris',
                        'O gingado do samba vem da alternância de peso entre os pés',
                        'Mantenha os braços soltos para acompanhar o balanço do corpo',
                        'Pratique o passo básico até dominar o ritmo antes de adicionar variações'
                    ]
                },
                'forro': {
                    title: 'Bicho do Mato (Rastapé) - Forró',
                    artist: 'Coreografia de Forró/Rastapé',
                    instruction: 'Forró selecionado! Observe como os fundamentos se aplicam a este estilo.',
                    videoSrc: 'https://www.youtube.com/embed/bjBx8aOJuq0?si=6pkyuV57pNWvG_nk',
                    tips: [
                        'Mantenha os pés próximos ao chão, deslizando suavemente',
                        'O cavalheiro conduz com as mãos na cintura da parceira',
                        'A dama deve seguir a condução mantendo contato visual',
                        'Pratique o dois pra lá e dois pra cá até sentir o ritmo'
                    ]
                },
                'pagode': {
                    title: 'aviões do forro',
                    artist: 'xande avião',
                    instruction: 'Pagode selecionado! Perceba a aplicação dos fundamentos neste estilo.',
                    videoSrc: 'https://www.youtube.com/embed/mIMGgP1QZ30?si=Hvc8C2tPwSWAzWzh',
                    tips: [
                        'O pagode tem um gingado mais suave que o samba',
                        'Mantenha os braços soltos e use-os para equilibrar o movimento',
                        'Os pés fazem movimentos curtos e rápidos',
                        'Pratique o "balanço da navalha" movendo os quadris em oito'
                    ]
                },
                'funk': {
                    title: 'Baile de Favela - MC João',
                    artist: 'Coreografia Daniel Saboya',
                    instruction: 'Funk selecionado! Veja como os fundamentos se adaptam a este estilo urbano.',
                    videoSrc: 'https://www.youtube.com/embed/vPbHG1YZuoI?si=yYsWqGc5ArTaH5YO',
                    tips: [
                        'Foque nos movimentos de quadris e pernas',
                        'Mantenha os joelhos flexionados para facilitar os rebolados',
                        'Use os braços para dar ênfase aos movimentos principais',
                        'Pratique cada movimento separadamente antes de combiná-los'
                    ]
                },
                'street': {
                    title: 'Pump It - Black Eyed Peas',
                    artist: 'Coreografia Street Dance',
                    instruction: 'Street Dance selecionado! Observe a aplicação dos fundamentos básicos.',
                    videoSrc: 'https://www.youtube.com/embed/ak-oaLEnyZE?si=xOPt7yrBbb0a8Y55',
                    tips: [
                        'Mantenha uma postura baixa com joelhos flexionados',
                        'Trabalhe o isolamento de diferentes partes do corpo',
                        'Pratique os movimentos no espelho para corrigir a postura',
                        'Combine passos básicos antes de tentar sequências complexas'
                    ]
                },
                'contemporanea': {
                    title: 'Caminhos',
                    artist: 'Trio contemporâneo',
                    instruction: 'Dança Contemporânea! Veja como os fundamentos se expressam neste estilo.',
                    videoSrc: 'https://www.youtube.com/embed/608X9hCYc_E?si=jNG3CvqpAhoGjieo',
                    tips: [
                        'Foque na fluidez e conexão entre os movimentos',
                        'Trabalhe a respiração sincronizada com os movimentos',
                        'Use o espaço de forma consciente e expressiva',
                        'Pratique a queda e recuperação para desenvolver controle'
                    ]
                },
                'axe': {
                    title: 'Segure o Tchan - É O Tchan',
                    artist: 'Coreografia É o Tchan',
                    instruction: 'Axé selecionado! Aplique os fundamentos neste ritmo energético.',
                    videoSrc: 'https://www.youtube.com/embed/YWxiK7TFN5k?si=h3LysiTBkCCnItzh',
                    tips: [
                        'Mantenha alta energia e sorriso no rosto',
                        'Os movimentos são amplos e alegres',
                        'Trabalhe a coordenação de braços e pernas',
                        'Pratique os passos marcando o ritmo forte do axé'
                    ]
                },
                'dance': {
                    title: 'One More Time - Daft Punk',
                    artist: 'Coreografia Dance/House',
                    instruction: 'Dance eletrônica! Observe a aplicação dos fundamentos neste estilo.',
                    videoSrc: 'https://www.youtube.com/embed/4l8vDGLwWes?si=LenyO8jKXQIiUE81',
                    tips: [
                        'Mantenha o ritmo com movimentos precisos',
                        'Trabalhe a memória coreográfica repetindo sequências',
                        'Use todo o corpo, não apenas as pernas',
                        'Pratique com contagens musicais para melhor sincronização'
                    ]
                }
            };

            const data = genreData[genre];
            document.getElementById('songTitle').textContent = data.title;
            document.getElementById('songArtist').textContent = data.artist;
            document.getElementById('instructionText').textContent = data.instruction;

            // Update choreography video and tips
            updateChoreography(data);
        }

        function updateChoreography(data) {
            const videoElement = document.querySelector('.choreography-video');
            const tipsElement = document.querySelector('.choreography-tips');

            // Update video source
            if (data.videoSrc) {
                videoElement.src = data.videoSrc;
            }

            // Update tips
            tipsElement.innerHTML = `<h3>Dicas para esta coreografia:</h3><ul>`;
            data.tips.forEach(tip => {
                tipsElement.innerHTML += `<li>${tip}</li>`;
            });
            tipsElement.innerHTML += `</ul>`;
        }

        function startSequence() {
            document.getElementById('instructionText').textContent = 'Iniciando sequência de fundamentos! Pratique cada elemento por 30 segundos.';

            let currentSequenceStep = 1;
            const sequenceInterval = setInterval(() => {
                selectStep(currentSequenceStep);
                currentSequenceStep++;

                if (currentSequenceStep > 6) {
                    clearInterval(sequenceInterval);
                    document.getElementById('instructionText').textContent = 'Sequência completa! Parabéns por praticar todos os fundamentos! 🎉';
                }
            }, 5000); // 5 segundos para cada fundamento
        }

        function startSession() {
            document.getElementById('instructionText').textContent = `Sessão de ${currentGenre.toUpperCase()} iniciada! Aplique os fundamentos básicos enquanto acompanha a coreografia! 🎵`;
            playPause();
        }

        function playPause() {
            isPlaying = !isPlaying;
            const playBtn = document.getElementById('playBtn');

            if (isPlaying) {
                playBtn.textContent = '⏸';
                startProgress();
            } else {
                playBtn.textContent = '▶';
                stopProgress();
            }
        }

        function startProgress() {
            progressInterval = setInterval(() => {
                progress += 1;
                if (progress >= 100) {
                    progress = 0;
                }
                document.getElementById('progress').style.width = progress + '%';
            }, 100);
        }

        function stopProgress() {
            clearInterval(progressInterval);
        }

        function previousTrack() {
            progress = 0;
            document.getElementById('progress').style.width = '0%';
            document.getElementById('instructionText').textContent = 'Música anterior selecionada! Continue aplicando os fundamentos.';
        }

        function nextTrack() {
            progress = 0;
            document.getElementById('progress').style.width = '0%';
            document.getElementById('instructionText').textContent = 'Próxima música selecionada! Aplique os fundamentos neste novo ritmo.';
        }

        // Auto-update instructions every 5 seconds when playing
        setInterval(() => {
            if (isPlaying) {
                const tips = [
                    'Lembre-se de respirar profundamente durante os movimentos!',
                    'Mantenha os joelhos flexionados para maior estabilidade!',
                    'Foque na transferência suave de peso entre os pés!',
                    'Observe sua postura no espelho e faça ajustes!',
                    'Sinta a música e deixe o corpo fluir naturalmente!'
                ];
                const currentInstruction = document.getElementById('instructionText').textContent;
                // Only change if it's not a step-specific instruction
                if (!currentInstruction.includes('Percepção Rítmica:') &&
                    !currentInstruction.includes('Controle de Peso:') &&
                    !currentInstruction.includes('Flexão de Joelhos:') &&
                    !currentInstruction.includes('Postura Corporal:') &&
                    !currentInstruction.includes('Consciência Espacial:') &&
                    !currentInstruction.includes('Coordenação Motora:')) {
                    const randomIndex = Math.floor(Math.random() * tips.length);
                    document.getElementById('instructionText').textContent = tips[randomIndex];
                }
            }
        }, 5000);

        // Initial setup for the first video
        document.addEventListener('DOMContentLoaded', () => {
            selectGenre('samba');
            selectStep(1); // Select the first step card
        });
