import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {UsersOverviewGuard} from "components/routing/routeProtectors/UsersOverviewGuard";
import UsersOverviewRouter from "components/routing/routers/UsersOverviewRouter";
import {ProfilepageGuard} from "components/routing/routeProtectors/ProfilepageGuard";
// import ProfilepageRouter from "components/routing/routers/ProfilepageRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import {RegisterGuard} from "components/routing/routeProtectors/RegisterGuard";
import Login from "components/views/Login";
import Register from "components/views/Register"
import Profilepage from "components/views/Profilepage";
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/UsersOverview">
          <UsersOverviewGuard>
            <UsersOverviewRouter base="/UsersOverview"/>
          </UsersOverviewGuard>
        </Route>
        {/*<Route path="/Profilepage">*/}
        <Route path="/Profilepage" >
          <ProfilepageGuard>
            <Profilepage/>
          </ProfilepageGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <RegisterGuard>
            <Register/>
          </RegisterGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/login"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
