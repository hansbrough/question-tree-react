import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import Home from "./components/Home";
import sequentialPath from "./components/sequentialPath";
import detourPath from "./components/detourPath";
import skipPath from "./components/skipPath";
import compoundConditionalPath from "./components/compoundConditionalPath";
import mixedConditionalPath from "./components/mixedConditionalPath";
/*--Styles--*/
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header" style={{height:'12rem', minHeight:"auto"}}>
        <h1 style={{marginBottom:'.5rem'}}>Decision Tree Demo</h1>
        <p style={{marginTop:'.5rem'}}>How to use the npm 'question-tree-core' package with React</p>
        <nav>
          <NavLink exact to="/" activeClassName="active">Overview</NavLink>
          <NavLink exact to="/sequential-path" activeClassName="active">Sequential</NavLink>
          <NavLink exact to="/detour-path" activeClassName="active">Detour</NavLink>
          <NavLink exact to="/shortcut-path" activeClassName="active">Shortcut</NavLink>
          <NavLink exact to="/compound-conditional-path" activeClassName="active">Compound Conditional</NavLink>
          <NavLink exact to="/mixed-conditional-path" activeClassName="active">Mixed Conditional</NavLink>
        </nav>
      </header>
      <Route render={(props) => {
        const { location } = props;
        return (
          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route exact path="/sequential-path" component={sequentialPath} />
            <Route exact path="/detour-path" component={detourPath} />
            <Route exact path="/shortcut-path" component={skipPath} />
            <Route exact path="/compound-conditional-path" component={compoundConditionalPath} />
            <Route exact path="/mixed-conditional-path" component={mixedConditionalPath} />
          </Switch>
        )}
      }
      />
        <footer>
          <div className="content-container">
           <span>Available on npmjs: <a href="https://www.npmjs.com/package/question-tree-core" target="_blank" rel="noreferrer">question-tree-core</a></span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
