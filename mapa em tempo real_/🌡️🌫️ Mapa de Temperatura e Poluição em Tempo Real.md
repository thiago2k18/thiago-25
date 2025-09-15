# 🌡️🌫️ Mapa de Temperatura e Poluição em Tempo Real

Um aplicativo web moderno desenvolvido em React que exibe dados de temperatura e qualidade do ar em tempo real através de um mapa interativo.

## 🚀 Funcionalidades

### 🗺️ Mapa Interativo
- **Visualização em tempo real** de dados de temperatura e poluição
- **Marcadores coloridos** baseados na qualidade do ar e temperatura
- **Clique nos marcadores** para ver informações detalhadas
- **Adicionar novos locais** clicando no mapa (modo tempo real)
- **Sistema de coordenadas** com conversão automática

### 📊 Dados em Tempo Real
- **Temperatura**: Via API Open-Meteo (gratuita, sem API key)
  - Temperatura atual, umidade, velocidade do vento
  - Atualização a cada 1 minuto
- **Qualidade do Ar**: Via API AQICN (token demo)
  - AQI, PM2.5, PM10, O3, NO2, SO2, CO
  - Atualização a cada 5 minutos

### 📈 Visualização de Dados
- **Gráficos interativos** com Recharts
- **Estatísticas em tempo real** com cálculos automáticos
- **Sistema de cores** inteligente para classificação
- **Interface responsiva** para desktop e mobile

### ⚡ Sistema de Tempo Real
- **Ativação/desativação** via botão no header
- **Atualizações automáticas** quando ativo
- **Indicadores visuais** de status
- **Simulação de usuários online**

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones
- **Recharts** - Gráficos interativos

### APIs Integradas
- **Open-Meteo** - Dados meteorológicos (gratuita)
- **AQICN** - Qualidade do ar (token demo)

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado) ou npm

### Passos para Execução

1. **Clone ou acesse o diretório do projeto**
   ```bash
   cd weather-pollution-map
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   pnpm run dev --host
   ```

4. **Acesse a aplicação**
   - Local: http://localhost:5173/
   - Rede: http://[seu-ip]:5173/

## 🎮 Como Usar

### Interface Principal
1. **Visualizar dados**: Observe os marcadores coloridos no mapa
2. **Ativar tempo real**: Clique em "Iniciar Tempo Real"
3. **Ver detalhes**: Clique nos marcadores para informações completas
4. **Adicionar locais**: Com tempo real ativo, clique em áreas vazias do mapa
5. **Remover locais**: Use o botão "Remover" no modal de detalhes

### Interpretação das Cores
- **Verde**: Boa qualidade do ar (AQI ≤ 50)
- **Amarelo**: Qualidade moderada (AQI 51-100)
- **Laranja**: Insalubre para grupos sensíveis (AQI 101-150)
- **Vermelho**: Insalubre (AQI 151-200)
- **Roxo**: Muito insalubre (AQI 201-300)
- **Marrom**: Perigoso (AQI > 300)

### Gráficos
- **Linha vermelha**: Temperatura
- **Linha azul**: Umidade
- **Linha verde**: Velocidade do vento
- **Barras laranja**: AQI
- **Barras vermelhas**: PM2.5
- **Barras roxas**: PM10

## 📁 Estrutura do Projeto

```
weather-pollution-map/
├── public/                     # Arquivos estáticos
├── src/
│   ├── components/             # Componentes React
│   │   ├── InteractiveMap.jsx      # Mapa interativo
│   │   ├── DataStats.jsx           # Estatísticas dos dados
│   │   ├── WeatherChart.jsx        # Gráficos de dados
│   │   └── ui/                     # Componentes UI (shadcn)
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useWeatherData.js       # Hook para dados meteorológicos
│   │   └── usePollutionData.js     # Hook para dados de poluição
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos principais
│   └── main.jsx                # Ponto de entrada
├── dist/                       # Build de produção
├── package.json                # Dependências e scripts
└── README.md                   # Esta documentação
```

## 🔧 Scripts Disponíveis

- `pnpm run dev` - Inicia o servidor de desenvolvimento
- `pnpm run build` - Gera build de produção
- `pnpm run preview` - Visualiza o build de produção
- `pnpm run lint` - Executa o linter

## 🌟 Características Técnicas

### Arquitetura
- **Hooks personalizados** para gerenciamento de estado
- **Componentes modulares** e reutilizáveis
- **Tratamento de erros** robusto
- **Otimização de performance** com debounce

### APIs
- **Open-Meteo**: Totalmente gratuita, sem limitações
- **AQICN**: Token demo com limitações (fácil upgrade)

### Responsividade
- **Layout adaptável** para diferentes tamanhos de tela
- **Gráficos responsivos** que se ajustam automaticamente
- **Interface otimizada** para touch em dispositivos móveis

## 🚀 Deploy e Produção

### Build de Produção
```bash
pnpm run build
```

### Opções de Deploy
- **Vercel**: Deploy automático via Git
- **Netlify**: Drag & drop da pasta `dist/`
- **GitHub Pages**: Via GitHub Actions
- **Servidor próprio**: Upload da pasta `dist/`

### Configurações para Produção
1. **CORS**: APIs já configuradas para aceitar requisições de qualquer origem
2. **HTTPS**: Recomendado para APIs externas
3. **Cache**: Configurar cache para assets estáticos

## 🔄 Atualizações e Melhorias

### Próximas Funcionalidades
- **Integração com Google Maps** (opcional)
- **Histórico de dados** com armazenamento local
- **Notificações** para alertas de qualidade do ar
- **Filtros avançados** por tipo de poluente
- **Exportação de dados** em CSV/JSON

### Otimizações Planejadas
- **Code splitting** para reduzir bundle size
- **Service Worker** para cache offline
- **PWA** para instalação em dispositivos
- **Lazy loading** de componentes

## 🐛 Solução de Problemas

### Problemas Comuns

**Dados não carregam:**
- Verifique conexão com internet
- APIs podem ter limitações temporárias
- Aguarde alguns segundos e tente novamente

**Gráficos não aparecem:**
- Certifique-se que há dados carregados
- Ative o modo tempo real
- Adicione mais locais para melhor visualização

**Performance lenta:**
- Reduza número de locais monitorados
- Desative tempo real quando não necessário
- Limpe cache do navegador

### Logs de Debug
Abra o console do navegador (F12) para ver logs detalhados das requisições às APIs.

## 📄 Licença

Este projeto foi desenvolvido como demonstração técnica de integração com APIs de dados meteorológicos e de qualidade do ar.

## 🤝 Contribuição

### Como Contribuir
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes
- Mantenha o código limpo e bem documentado
- Teste todas as funcionalidades antes do commit
- Siga os padrões de código existentes
- Atualize a documentação quando necessário

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- Abra uma issue no repositório
- Consulte a documentação das APIs utilizadas
- Verifique os logs do console para debug

---

**Desenvolvido com ❤️ usando React e tecnologias modernas**

*Aplicativo 100% funcional com dados reais de temperatura e poluição do ar*

