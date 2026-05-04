/** @type {import('tailwindcss').Config} */
export default {
  // Diz ao Tailwind quais arquivos ele deve "escanear" para gerar o CSS
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aqui adicionamos cores personalizadas do nosso tema Pac-Man
      colors: {
        pacman: {
          yellow: '#FFD700',       // Amarelo do Pac-Man
          darkYellow: '#FFA500',   // Laranja para hover
          bg: '#0a0a0a',           // Fundo quase preto
          surface: '#1a1a1a',      // Fundo dos cards
          border: '#2a2a2a',       // Bordas sutis
          ghost: {
            red: '#FF0000',        // Fantasma vermelho
            pink: '#FFB8FF',       // Fantasma rosa
            cyan: '#00FFFF',       // Fantasma ciano
          }
        }
      },
      // Fonte estilo arcade
      fontFamily: {
        arcade: ['"Press Start 2P"', 'cursive'],
        body: ['"Rajdhani"', 'sans-serif'],
      },
      // Animações personalizadas
      animation: {
        'chomp': 'chomp 0.3s infinite alternate',
        'blink': 'blink 1s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        chomp: {
          '0%': { borderRadius: '50% 50% 50% 50%' },
          '100%': { borderRadius: '50% 50% 50% 0%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}