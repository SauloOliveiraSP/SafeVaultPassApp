const tintColorLight = '#6C9DC2';  // Azul suave e elegante
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#3C3C3C', // Texto em cinza escuro suave
    background: '#F4F5F7',  // Fundo neutro e suave (cinza claro)
    tint: tintColorLight,  // Azul suave para detalhes
    icon: '#6A7C85',  // Cinza esverdeado para ícones, equilibrando modernidade e elegância
    tabIconDefault: '#A0A9B1', // Ícones inativos com tom mais suave
    tabIconSelected: tintColorLight,  // Ícones ativos com azul suave
    buttonBackground: '#D1E6F1',  // Azul pastel suave para botões
    inputBackground: '#fff',  // Branco para campos de entrada no modo claro
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    buttonBackground: '#2A2C2E',
    inputBackground: '#333',  // Escuro para campos de entrada no modo escuro
  },
};
