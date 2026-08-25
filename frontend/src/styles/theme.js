import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0a1628',
      light: '#1a3a5c',
      dark: '#060e1a',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#00d4ff',
      light: '#4de3ff',
      dark: '#00a3cc',
      contrastText: '#0a1628'
    },
    accent: {
      main: '#ff6b35',
      light: '#ff8f61',
      dark: '#cc4a1a'
    },
    success: {
      main: '#00e676',
      light: '#69f0ae',
      dark: '#00a152'
    },
    warning: {
      main: '#ffd740',
      light: '#ffe57f',
      dark: '#c8a600'
    },
    error: {
      main: '#ff1744',
      light: '#ff616f',
      dark: '#d50000'
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff'
    },
    text: {
      primary: '#0a1628',
      secondary: '#4a6a7f',
      disabled: '#8aa3b8'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2842 100%)',
      secondary: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
      accent: 'linear-gradient(135deg, #ff6b35 0%, #ff8f61 100%)',
      hero: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 30%, #0d2842 60%, #060e1a 100%)'
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.8rem',
      color: '#0a1628',
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      color: '#0a1628',
      letterSpacing: '-0.01em'
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.8rem',
      color: '#0a1628'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#0a1628'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#0a1628'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#0a1628'
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#4a6a7f'
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#6a8a9f'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#1a2a3a'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.7,
      color: '#4a6a7f'
    }
  },
  shape: {
    borderRadius: 16
  },
  shadows: [
    'none',
    '0 2px 8px rgba(10,22,40,0.06)',
    '0 4px 16px rgba(10,22,40,0.08)',
    '0 8px 24px rgba(10,22,40,0.10)',
    '0 12px 32px rgba(10,22,40,0.12)',
    '0 16px 40px rgba(10,22,40,0.14)',
    '0 20px 48px rgba(10,22,40,0.16)',
    '0 24px 56px rgba(10,22,40,0.18)',
    '0 28px 64px rgba(10,22,40,0.20)',
    '0 32px 72px rgba(10,22,40,0.22)',
    '0 36px 80px rgba(10,22,40,0.24)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '12px 28px',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          letterSpacing: '0.3px',
          boxShadow: 'none'
        },
        contained: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
          color: '#0a1628',
          '&:hover': {
            background: 'linear-gradient(135deg, #00e5ff 0%, #00b8d4 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,212,255,0.35)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #1a3a5c 0%, #0a1628 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(10,22,40,0.4)'
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f61 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff8f61 0%, #ff6b35 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255,107,53,0.35)'
          }
        },
        outlined: {
          borderColor: '#00d4ff',
          color: '#00d4ff',
          '&:hover': {
            background: 'rgba(0,212,255,0.08)',
            borderColor: '#00e5ff',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
          border: '1px solid rgba(10,22,40,0.04)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#ffffff',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 60px rgba(10,22,40,0.12)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(10,22,40,0.06)'
        },
        elevation2: {
          boxShadow: '0 8px 30px rgba(10,22,40,0.08)'
        },
        elevation3: {
          boxShadow: '0 12px 40px rgba(10,22,40,0.10)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2842 100%)',
          boxShadow: '0 4px 30px rgba(10,22,40,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 28,
          '&:last-child': {
            paddingBottom: 28
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            background: 'rgba(255,255,255,0.9)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00d4ff',
              borderWidth: 2
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00d4ff',
              borderWidth: 2,
              boxShadow: '0 0 0 4px rgba(0,212,255,0.1)'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#4a6a7f',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#00d4ff'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '4px 8px'
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #00e676 0%, #00a152 100%)',
          color: '#ffffff'
        },
        colorWarning: {
          background: 'linear-gradient(135deg, #ffd740 0%, #c8a600 100%)',
          color: '#0a1628'
        },
        colorError: {
          background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
          color: '#ffffff'
        },
        colorInfo: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
          color: '#0a1628'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.95rem',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            color: '#00d4ff'
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(255,255,255,0.1)'
        }
      }
    }
  }
});
