import React, { Component } from 'react';
import { 
  Route, 
  Link, 
  Redirect,
  withRouter,
  BrowserRouter as Router, } from 'react-router-dom';
import './App.css';


const Courses = ({ match }) => (
  <div>
     <ul>
        <li><Link to={`${match.url}/technology`}>Technology</Link></li>
        <li><Link to={`${match.url}/business`}>Business</Link></li>
        <li><Link to={`${match.url}/economics`}>Economics</Link></li>
    </ul>


    <Route exact path={`${match.path}/:course`} render={({match}) => (<div> This is {match.params.course} </div>)}/>
  </div>
);


// const Home = () => (
//   <div>
//     <h2> Home </h2>
//   </div>
// );

// const Airport = () => (
//   <div>
//      <ul>
//       <li>Jomo Kenyatta</li>
//       <li>Tambo</li>
//       <li>Murtala Mohammed</li>
//     </ul>
//   </div>
// );

// const City = () => (
//   <div>
//     <ul>
//       <li>San Francisco</li>
//       <li>Istanbul</li>
//       <li>Tokyo</li>
//     </ul>
//   </div>
// );

const Public = () => (
  <div> This is a public page </div>
);



const Private = () => (
  <div> This is a private page </div>
);

class Login extends React.Component {
  state = {
    redirectToPreviousRoute: false
  };

  login = () => {
    AuthService.authenticate(() => {
      this.setState({ redirectToPreviousRoute: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToPreviousRoute } = this.state;

    if (redirectToPreviousRoute) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

const AuthService = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  logout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
};

const AuthStatus = withRouter(({ history }) => (
  AuthService.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        AuthService.logout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
));

const SecretRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} />
);

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
        <AuthStatus />
          <ul>
            <li><Link to='/public'> Public </Link></li>
            <li><Link to='/private'> Private </Link></li>
          </ul>
          <hr/>
          <Route path='/public' component={Public} />
          <Route path='/login' component={Login} />
          <SecretRoute path='/private' component={Private}/>
        </div>
      </Router>
    );
  }
}

export default App;