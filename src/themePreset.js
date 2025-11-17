import Lara from '@primevue/themes/lara';
import { definePreset } from '@primevue/themes';

const themePreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    },
    formField: {
      paddingX: '0.5rem',
      paddingY: '0.4rem',
    }
  },
  components: {
    button: {
      root: {
        iconOnlyWidth: '2rem',
        sm: {
          paddingY: '0.32rem'
        }
      }
    },
    toast: {
      width: 'auto'
    },
    datepicker: {
      date: {
        width: '2rem',
        height: '2rem',
        padding: '0.2rem'
      },
      dayView: {
        margin: '0.357rem 0 0 0'
      },
      header: {
        padding: '0 0 0.357rem 0'
      },
      panel: {
        padding: '0.8rem 0.8rem 0.5rem'
      }
    },
    radiobutton: {
      icon: {
        checked: {
          color: '#3b82f6',
          hover: {
            color: '#3b82f6',
          }
        }
      },
      checked: {
        background: '#fff',
        hover: {
          background: '#fff',
        }
      }
    },
    popover: {
      background: '#18181b',
      color: '#fff',
      shadow: '0 1px 3px rgba(0,0,0,0.1)',
      content: {
        padding: '0.6rem 0.8rem'
      }
    }
  }
});

export default themePreset
