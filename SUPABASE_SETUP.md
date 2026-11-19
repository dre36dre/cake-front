# Configuração do Supabase

O painel administrativo usa Supabase Auth, Database e Storage. As imagens aceitas são JPG, PNG e WebP, com limite de 5 MB.

## Preparar o projeto

1. Crie um projeto no Supabase e abra o **SQL Editor**.
2. Execute o conteúdo de [`supabase/setup.sql`](./supabase/setup.sql).
3. Em **Authentication → Users**, crie a conta da dona da loja. Desative o cadastro público de usuários nas configurações de Authentication.
4. Copie o UUID dessa conta e execute no SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('UUID-DA-CONTA-DA-DONA');
   ```

5. Em **Project Settings → API**, copie a Project URL e a chave `anon`/publishable. Preencha `SUPABASE_URL` e `SUPABASE_ANON_KEY` em [`src/app/config/supabase.config.ts`](./src/app/config/supabase.config.ts).
6. Publique novamente o site. A chave `anon` é pública e protegida pelas políticas RLS criadas no SQL; nunca use a chave `service_role` no aplicativo.
7. Cadastre produtos em `/admin/produtos` e as imagens extras da Home em `/admin/imagens-home`.

O painel exige login e a autorização de escrita é verificada no banco pela tabela `admin_users`. Sem as credenciais do projeto, o site continua compilando, mas as operações de dados exibem erro de configuração.

## Teste local sem Supabase

Ao iniciar a aplicação em desenvolvimento (`npm start`), existe um modo temporário apenas em `localhost` ou `127.0.0.1`:

- Usuário: `admin`
- Senha: `teste123`
- Produtos e imagens são gravados no IndexedDB deste navegador e permanecem após recarregar a página.

Esse modo não sincroniza com o Vercel nem com outros dispositivos. As credenciais são substituídas por valores vazios nos builds de produção. Não use esse login como autenticação de produção.
