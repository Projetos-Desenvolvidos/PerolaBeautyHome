// ===== FORMULÁRIO DE CAPTAÇÃO DE LEADS =====

// Função para formatar mensagem para WhatsApp
function formatarMensagemWhatsApp(formData) {
    const servicoNome = {
        'maquiagem': 'Maquiagem',
        'coloracao': 'Coloração',
        'corte': 'Corte',
        'mechas': 'Mechas',
        'combo': 'Combo Completo',
        'outro': 'Outro'
    };

    let mensagem = `*Nova Solicitação de Agendamento - Pérola Beauty Home*\n\n`;
    mensagem += `*Nome:* ${formData.nome}\n`;
    mensagem += `*Telefone:* ${formData.telefone}\n`;
    mensagem += `*E-mail:* ${formData.email}\n`;
    mensagem += `*Serviço de Interesse:* ${servicoNome[formData.servico] || formData.servico}\n`;
    
    if (formData.mensagem && formData.mensagem.trim()) {
        mensagem += `*Mensagem:* ${formData.mensagem}\n`;
    }
    
    mensagem += `\n_Enviado através do site em ${new Date().toLocaleString('pt-BR')}_`;
    
    return mensagem;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-lead');
    const telefoneInput = document.getElementById('telefone');
    const btnSubmit = form.querySelector('.btn-submit');

    // Máscara de telefone
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            e.target.value = value;
        }
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Remove classes de erro
        formGroup.classList.remove('error');

        // Validação específica por campo
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'Este campo é obrigatório';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Digite um e-mail válido';
            }
        } else if (field.type === 'tel' && field.value) {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                message = 'Digite um telefone válido';
            }
        }

        if (!isValid) {
            formGroup.classList.add('error');
            errorMessage.textContent = message;
        } else {
            errorMessage.textContent = '';
        }

        return isValid;
    }

    // Submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Valida todos os campos
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll para o primeiro erro
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Mostra loading
        btnSubmit.classList.add('loading');
        btnSubmit.disabled = true;

        // Coleta dados do formulário
        const formData = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            servico: document.getElementById('servico').value,
            mensagem: document.getElementById('mensagem').value,
            dataEnvio: new Date().toISOString()
        };

        try {
            // Formata a mensagem para WhatsApp
            const mensagemWhatsApp = formatarMensagemWhatsApp(formData);
            
            // Número do WhatsApp (código do país + DDD + número, sem espaços)
            const numeroWhatsApp = '5511963185396';
            
            // Cria o link do WhatsApp
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
            
            // Salva no localStorage como backup
            const leads = JSON.parse(localStorage.getItem('leads') || '[]');
            leads.push(formData);
            localStorage.setItem('leads', JSON.stringify(leads));

            // Abre o WhatsApp em nova aba
            window.open(urlWhatsApp, '_blank');
            
            // Simula delay para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mostra mensagem de sucesso
            const successMessage = document.getElementById('form-success');
            successMessage.classList.add('show');
            form.reset();
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Google Analytics Event (se tiver)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'lead',
                    'event_label': formData.servico
                });
            }

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Erro ao enviar formulário. Por favor, tente novamente ou entre em contato pelo telefone.');
        } finally {
            btnSubmit.classList.remove('loading');
            btnSubmit.disabled = false;
            
            // Remove mensagem de sucesso após 5 segundos
            setTimeout(() => {
                const successMessage = document.getElementById('form-success');
                if (successMessage) {
                    successMessage.classList.remove('show');
                }
            }, 5000);
        }
    });

    // Scroll suave para links de âncora (melhorado)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navbar = document.querySelector('.navbar');
                    const headerHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

