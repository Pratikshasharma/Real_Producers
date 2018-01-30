import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import App from './App'
import About from './components/About'
import Home from './components/Home'
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const Routes = (props) => (

<MuiThemeProvider>
	<BrowserRouter>
      <div>
	      <Route path="/" component={App} />
	      <Route path="/home" component={Home} />
	      <Route path="/about" component={About} />
      </div>
    </BrowserRouter>
</MuiThemeProvider>
);

export default Routes
