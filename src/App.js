import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import { Add, PlayArrow } from 'material-ui-icons';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from 'material-ui/styles';
import styled from 'styled-components';

import { Map, List } from 'immutable';

import ClassNode from './ClassNode';
import LogPane from './LogPane';
import GetValueDialog from './GetValueDialog';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#484848',
      main: '#41423D',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f9683a',
      main: '#bf360c',
      dark: '#870000',
      contrastText: '#fff',
    },
  },
});

const Wrapper = styled.div`
  color: #fff;
  background-color: #000;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
`;

const styles = thm => ({
  leftIcon: {
    marginRight: thm.spacing.unit,
  },
});

const MyToolbar = styled(Toolbar)`
  && {
    min-height: 40px;
    padding: 0;
  }
`;

const ToolButton = props => <Button color="inherit" {...props} />;

const BottomLogPane = styled(LogPane)`
  position: absolute;
  width: 100%;
  bottom: 0;
`;

class App extends React.Component {
  state = {
    doc: Map({
      classes: List([
        Map({
          name: 'Program',
          width: 200,
          height: 200,
          x: 20,
          y: 70,
          methods: List([
            Map({
              header: 'static main()',
              body: 'console.log("Hello world");',
            }),
            Map({
              header: 'doAmazingStuff(duration)',
              body: 'console.log("Hello world");',
            }),
          ]),
        }),
      ]),
      counter: 0,
    }),
    log: List(['Hello world!!!']),
    mainSelDiag: Map({
      open: false,
    }),
  };

  onClassChange(grClass) {
    this.setState({
      doc: this.state.doc.update('classes', classes =>
        classes.set(
          classes.findIndex(item => item.get('name') === grClass.get('name')),
          grClass,
        )),
    });
  }

  onAddClassClick() {
    const clsNumber = this.state.doc.get('counter') + 1;
    this.setState({
      doc: this.state.doc
        .update('classes', classes =>
          classes.push(Map({
            name: `Class${clsNumber}`,
            width: 200,
            height: 200,
            x: 20,
            y: 70,
            methods: List([
              Map({
                header: 'method(par1, par2)',
              }),
            ]),
          })))
        .set('counter', clsNumber),
    });
  }

  onMainChange(main) {
    this.setState({
      doc: this.state.doc.set('main', main),
    });
  }

  onOpenMainSelDiag() {
    this.setState({
      mainSelDiag: this.state.mainSelDiag.set('open', true),
    });
  }

  onCloseMainSelDiag() {
    this.setState({
      mainSelDiag: this.state.mainSelDiag.set('open', false),
    });
  }

  render() {
    const { classes } = this.props;
    const { doc, log, mainSelDiag } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Wrapper>
          <AppBar position="static">
            <MyToolbar>
              <ToolButton onClick={() => this.onAddClassClick()}>
                <Add className={classes.leftIcon} />
                Nová třída
              </ToolButton>
              <ToolButton>
                <PlayArrow className={classes.leftIcon} />
                Spustit
              </ToolButton>
              <ToolButton onClick={() => this.onOpenMainSelDiag()}>
                Nastavit main
              </ToolButton>
            </MyToolbar>
          </AppBar>
          {doc
            .get('classes')
            .map(grClass => (
              <ClassNode
                key={grClass.get('name')}
                grClass={grClass}
                onChange={d => this.onClassChange(d)}
              />
            ))}
          <BottomLogPane items={log} />

          <GetValueDialog
            open={mainSelDiag.get('open')}
            title="Main method name"
            message="e.g.: Program.main"
            value={doc.get('main')}
            onChange={main => this.onMainChange(main)}
            onClose={() => this.onCloseMainSelDiag()}
          />
        </Wrapper>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
