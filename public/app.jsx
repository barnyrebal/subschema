var React = require('react');
import {render} from 'react-dom'
import Router, { Route,IndexRoute }  from 'react-router';
require('./sample.less');

var SampleItem = require('./SampleItem.jsx');
var Index = require('./Index.jsx');
var App = require('./Sample.jsx');
var Setup = require('./Setup.jsx');

var routes = (
    <Route component={App} path="/">
        <IndexRoute  component={Index}/>
        <Route name="item" path=":sample" component={SampleItem}/>
        <Route name="setup" path="setup/:setup" component={Setup}/>
    </Route>
);

render(<Router>{routes}</Router>, document.getElementById('content'));