# 🚀 Guia de Implantação - Mapa de Temperatura e Poluição

Este guia fornece instruções detalhadas para implantar o aplicativo em diferentes plataformas de hospedagem.

## 📋 Pré-requisitos

- Build de produção gerado (`pnpm run build`)
- Pasta `dist/` com os arquivos compilados
- Conta na plataforma de hospedagem escolhida

## 🌐 Opções de Implantação

### 1. Vercel (Recomendado)

**Vantagens:**
- Deploy automático via Git
- HTTPS gratuito
- CDN global
- Domínio personalizado gratuito

**Passos:**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub/GitLab
3. Importe o repositório do projeto
4. Configure as seguintes opções:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
5. Clique em "Deploy"

**Configuração adicional:**
```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. Netlify

**Vantagens:**
- Interface simples
- Deploy via drag & drop
- Formulários e funções serverless
- HTTPS automático

**Passos:**
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `dist/` para a área de deploy
3. Ou conecte via Git:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`

**Configuração adicional:**
```toml
# netlify.toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

**Vantagens:**
- Gratuito para repositórios públicos
- Integração nativa com GitHub
- Domínio github.io incluído

**Passos:**
1. Crie um arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. Ative GitHub Pages nas configurações do repositório
3. Selecione a branch `gh-pages` como fonte

### 4. Firebase Hosting

**Vantagens:**
- CDN global do Google
- HTTPS automático
- Integração com outros serviços Firebase

**Passos:**
1. Instale Firebase CLI: `npm install -g firebase-tools`
2. Faça login: `firebase login`
3. Inicialize o projeto: `firebase init hosting`
4. Configure:
   - **Public directory**: `dist`
   - **Single-page app**: `Yes`
5. Deploy: `firebase deploy`

**Configuração:**
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. Servidor Próprio (VPS/Dedicado)

**Para Apache:**
```apache
# .htaccess
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

**Para Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/weather-app/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🔧 Configurações de Produção

### Variáveis de Ambiente

Se você quiser usar APIs com chaves personalizadas, crie um arquivo `.env.production`:

```env
# Opcional: Chave do Google Maps (se quiser usar mapa real)
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui

# Opcional: Token AQICN personalizado (para mais requisições)
VITE_AQICN_TOKEN=seu_token_aqui
```

### Otimizações de Performance

**1. Configurar Headers de Cache:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['lucide-react']
        }
      }
    }
  }
}
```

**2. Configurar Service Worker (PWA):**
```javascript
// Instalar vite-plugin-pwa
npm install -D vite-plugin-pwa

// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
}
```

## 🌍 Configuração de Domínio

### Domínio Personalizado

**Para Vercel:**
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS apontando para Vercel

**Para Netlify:**
1. Vá em Domain settings
2. Adicione custom domain
3. Configure DNS conforme instruções

**Configuração DNS típica:**
```
Tipo: CNAME
Nome: www
Valor: seu-app.vercel.app (ou netlify.app)

Tipo: A
Nome: @
Valor: IP fornecido pela plataforma
```

## 📊 Monitoramento

### Analytics

**Google Analytics:**
```html
<!-- Adicionar no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Monitoramento de Performance

**Sentry (Opcional):**
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 🔒 Segurança

### Headers de Segurança

**Para Netlify:**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.open-meteo.com https://api.waqi.info;"
```

### HTTPS

Todas as plataformas mencionadas fornecem HTTPS automático. Para servidor próprio:

```bash
# Usando Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🚨 Solução de Problemas

### Problemas Comuns

**Build falha:**
- Verifique se todas as dependências estão instaladas
- Confirme que o Node.js é versão 18+
- Limpe cache: `pnpm store prune`

**APIs não funcionam em produção:**
- Verifique se as URLs das APIs são HTTPS
- Confirme configurações de CORS
- Teste APIs diretamente no navegador

**Roteamento não funciona:**
- Configure redirects para SPA
- Verifique se o servidor está servindo index.html para todas as rotas

**Performance lenta:**
- Ative compressão gzip
- Configure cache headers
- Use CDN para assets estáticos

### Logs e Debug

**Vercel:**
```bash
vercel logs seu-app-url
```

**Netlify:**
- Acesse Deploy logs no dashboard
- Use Netlify CLI: `netlify logs`

**Firebase:**
```bash
firebase hosting:channel:open preview-channel
```

## 📈 Otimização Contínua

### Métricas a Monitorar

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

2. **Performance**
   - Tempo de carregamento inicial
   - Tempo de resposta das APIs
   - Uso de memória

3. **Usuário**
   - Taxa de rejeição
   - Tempo na página
   - Interações com o mapa

### Ferramentas de Análise

- **Lighthouse**: Auditoria de performance
- **PageSpeed Insights**: Métricas do Google
- **GTmetrix**: Análise detalhada de carregamento
- **WebPageTest**: Testes de diferentes localizações

---

**🎉 Parabéns! Seu aplicativo está pronto para o mundo!**

*Para suporte adicional, consulte a documentação da plataforma escolhida ou abra uma issue no repositório.*

