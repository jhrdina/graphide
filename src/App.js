// Copyright (C) 2018 Jan Hrdina
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
import Runner from './Runner';

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
  constructor() {
    super();
    this.state = {
      doc: Map({
        classes: List([
          Map({
            name: 'Program',
            width: 230,
            height: 200,
            x: 20,
            y: 70,
            methods: List([
              Map({
                header: 'static main()',
                body:
                  'let prog = new Program();\n' + "prog.printHello('World');",
              }),
              Map({
                header: 'printHello(toWho)',
                body: 'log(`Hello ${toWho}!`);',
              }),
            ]),
          }),
        ]),
        counter: 0,
        main: 'Program.main',
      }),
      log: List(),
      mainSelDiag: Map({
        open: false,
      }),
      runner: new Runner(),
    };

    this.state.runner.addClasses(this.state.doc.get('classes'));
    window.log = (...params) => {
      this.setState({
        log: this.state.log.push(params.join(' ')),
      });
    };
  }

  onClassChange(grClass, oldClass) {
    this.setState({
      doc: this.state.doc.update('classes', classes =>
        classes.set(
          classes.findIndex(item => item.get('name') === grClass.get('name')),
          grClass,
        )),
    });
    this.state.runner.updateClass(grClass, oldClass);
  }

  onClassDelete(grClass) {
    this.setState({
      doc: this.state.doc.update('classes', classes =>
        classes.delete(classes.findIndex(item => item.get('name') === grClass.get('name')))),
    });
    this.state.runner.removeClass(grClass);
  }

  onAddClassClick() {
    const clsNumber = this.state.doc.get('counter') + 1;
    const grClass = Map({
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
    });

    this.setState({
      doc: this.state.doc
        .update('classes', classes => classes.push(grClass))
        .set('counter', clsNumber),
    });

    this.state.runner.addClass(grClass);
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

  onRunClick() {
    try {
      Runner.run(this.state.doc.get('main'));
    } catch (e) {
      window.log(`${e.toString()}\n\nStack trace je vidět v konzoli DevTools.`);
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    const {
      doc, log, mainSelDiag,
    } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Wrapper>
          <AppBar position="static">
            <MyToolbar>
              <ToolButton onClick={() => this.onAddClassClick()}>
                <Add className={classes.leftIcon} />
                Nová třída
              </ToolButton>
              <ToolButton onClick={() => this.onRunClick()}>
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
                onChange={d => this.onClassChange(d, grClass)}
                onDelete={() => this.onClassDelete(grClass)}
              />
            ))}
          <BottomLogPane items={log} maxHeight={300} />

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
