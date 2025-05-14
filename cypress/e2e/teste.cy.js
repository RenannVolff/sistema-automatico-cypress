describe('Teste de Registro de Usuário', () => {
  // 1. Definindo a baseUrl corretamente
  const baseUrl = 'http://172.32.165.98:8000';

  it('Deve registrar um novo usuário com sucesso', () => {
    // 2. Dados do teste
    const user = {
      name: `Usuário ${Date.now()}`,
      email: `teste_${Date.now()}@exemplo.com`,
      password: "Senha@123",
      confirmacao: "Senha@123"
    };

    // 3. Visita a página de registro
    cy.visit(`${baseUrl}/register`);
    cy.screenshot('1-pagina-registro-inicial')
    // 4. Preenche o formulário (ajuste os seletores conforme seu HTML real)
     
    cy.get('input[name="name"]').should('be.visible').type(user.name);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password_confirmation"]').type(user.password);
    cy.get('button[type="submit"]').click();
    // 5. Submete o formulário

    // 6. Verificações pós-registro

    cy.url().should('match', /(index-conta|login)/, { timeout: 10000 });

    // Verifica se não há mensagens de erro
    cy.get('.alert-error').should('not.exist');
  });
});