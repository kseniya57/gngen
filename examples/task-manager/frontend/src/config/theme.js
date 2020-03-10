import { createMuiTheme } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: teal,
    secondary: {
      main: '#E57373'
    },
    error: {
      main: '#f4573c'
    }
  }
});
