import { Routes, Route } from 'react-router-dom';
import { LoginPage } from "./pages/LoginPage"
import { ControlsPage } from "./pages/ControlsPage"
import PrivateRoutes from './components/PrivateRoutes'
import RootRoute from './components/RootRoute'



function App() {
  return <Routes> 
    <Route path="/" element={<RootRoute/>}></Route>
    <Route path="/login" element={<LoginPage/>}>
    </Route>
    <Route element={<PrivateRoutes />}>
      <Route element={<ControlsPage/>} path="/controls" exact/>
    </Route>
  </Routes>
}

export default App;
