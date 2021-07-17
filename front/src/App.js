import { lazy, Suspense } from "react";
import {Route, Switch, useLocation} from 'react-router-dom'

const Main = lazy(() => import('./components/Main'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const WelcomeHome = lazy(() => import('./components/WelcomeHome'))
const ShoppingList = lazy(() => import('./components/ShoppingList'))
const Tasks = lazy(() => import('./components/Tasks'))
const Callendar = lazy(() => import('./components/Callendar'))
const RemindCode = lazy(() => import('./components/RemindCode'))
const ChangePass = lazy(() => import('./components/ChangePass'))

function App() {
  let location = useLocation();
  let background = location.state && location.state.background

  return (
    <div className="all">
      <Suspense fallback='loading...' >
        <Switch location={ location || background } >
          <Route exact path='/' children={ <Main/> } />
          <Route path='/login' children={ <Login/> } />
          <Route path='/register' children={ <Register/> } />
          <Route path='/home' children={ <Dashboard/> } />
          <Route path='/welcome' children={ <WelcomeHome/> } />
          <Route path='/home/tasks' children={ <Tasks/> } />
          <Route path='/home/callendar' children={ <Callendar/> } />
          <Route path='/home/shopping-list' children={ <ShoppingList/> } />
          <Route path='/remind-code' children={ <RemindCode/> } />
          <Route path='/home/change-password' children={ <ChangePass/> } />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
