export const blockedPaths = [
  // Diretórios e arquivos de controle de versão / configuração
  '/.git',
  '/.svn',
  '/.hg',
  '/.env',
  '/.env.local',
  '/.env.development',
  '/.env.production',

  // Arquivos de configuración do servidor e proteções HTTP
  '/web.config',
  '/.htaccess',
  '/.htpasswd',

  // Arquivos comuns que podem expor configurações sensíveis
  '/karma.conf.json',
  '/gruntfile.js',
  '/gulpfile.js',
  '/package.json', // Se sua aplicação não precisa expor este arquivo
  '/package-lock.json', // idem
  '/composer.json', // Se estiver usando PHP ou Composer
  '/composer.lock',

  // Arquivos e endpoints sensíveis ou de depuração
  '/debug.php',
  '/debugger.php',
  '/php_info.php',
  '/phpinfo',
  '/phpinfo.php',
  '/info.php',

  // Arquivos e endpoints de CMS e frameworks (se aplicável)
  '/wp-config.php',
  '/wp-admin',

  // Ide e configurações/arquivos de ambiente de desenvolvimento
  '/.idea',
  '/.vscode',
  // Outros que você julgar sensíveis:
  '/config.php',
  '/admin.php',
  '/favicon.svg',
]
