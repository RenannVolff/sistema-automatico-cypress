describe('Gerenciamento Completo de Contas', () => {
    const baseUrl = 'http://172.32.165.98:8000';
    
    // Função para gerar usuário de teste único
    const getTestUser = () => {
        const timestamp = Date.now();
        return {
            name: `Usuário ${timestamp}`,
            email: `teste_${timestamp}@exemplo.com`,
            password: "Senha@123",
            password_confirmation: "Senha@123"
        };
    };

    // Função para gerar conta de teste única
    const getTestAccount = () => ({
        nome: `Conta Teste ${Date.now()}`,
        valor: (Math.random() * 1000).toFixed(2),
        vencimento: '2024-12-31',
        situacao: 'Pendente'
    });

    it('Teste CRUD completo de contas', () => {
        // 1. Cadastro de usuário
        const user = getTestUser();
        cy.visit(`${baseUrl}/register`);
        
        cy.get('input[name="name"]').should('be.visible').type(user.name);
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="password"]').type(user.password);
        cy.get('input[name="password_confirmation"]').type(user.password);
        cy.get('button[type="submit"]').click();
        
        // Verifica se foi para a página correta após cadastro
        cy.url().should('include', '/index-conta', { timeout: 10000 });

        // 2. Cadastro de conta
        const conta = getTestAccount();
        cy.contains('Cadastrar').click();
        
        // Verifica se o formulário de conta está visível
        cy.get('form').should('be.visible');
        
        // Preenche o formulário com verificações
        cy.get('input[name="nome"]').should('be.visible').type(conta.nome);
        cy.get('input[name="valor"]').type(conta.valor);
        cy.get('input[name="vencimento"]').type(conta.vencimento);
        cy.get('select[name="situacao_conta_id"]').select(conta.situacao);
        
        // Submete o formulário
        cy.contains('button', 'Cadastrar').click();
        
        // Verifica mensagem de sucesso
        cy.contains('Conta cadastrada com sucesso', { timeout: 10000 }).should('be.visible');
        cy.contains('OK').click();

        // 3. Verificação da conta na listagem
        cy.contains('Listar').click();
        
        // Espera a tabela carregar completamente
        cy.get('table', { timeout: 15000 }).should('be.visible');
        cy.get('tbody tr', { timeout: 10000 }).should('have.length.gt', 0);
        
        
        // 4. Edição da conta
        const contaEditada = {
            ...conta,
            nome: `${conta.nome} Editada`,
            valor: '999.99',
            situacao: 'Paga'
        };

        cy.contains(conta.nome).parent().contains('Visualizar').click();
        cy.contains('Editar').click();
        cy.get('input[name="nome"]').clear().type(contaEditada.nome);
        cy.get('input[name="valor"]').clear().type(contaEditada.valor);
        cy.get('select[name="situacao_conta_id"]').select(contaEditada.situacao);
        cy.contains('Salvar').click();
        cy.contains('OK').click();

        // 5. Verificação da edição
        cy.contains('Listar').click();
        cy.get('input[name="nome"]').type(contaEditada.nome);
        cy.contains(contaEditada.nome).should('exist');

        // 6. Exclusão da conta
        cy.contains(contaEditada.nome).parent().contains('Apagar').click();
        cy.contains('OK').click();
        cy.contains(contaEditada.nome).should('not.exist');

        // 7. Logout e login
        cy.contains('Logout').click();
        cy.visit(`${baseUrl}/login`);
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="password"]').type(user.password);
        cy.contains('Entrar').click();
        cy.url().should('include', '/index-conta');
    });
});