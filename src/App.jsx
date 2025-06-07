import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room'; 
import Home from './pages/Home'; 
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />  
         <Route component={NotFound} /> 
      </Routes>
    </Router>
  );
};

export default App;

