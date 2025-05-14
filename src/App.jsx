import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room'; 
import Home from './pages/Home'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />  
      </Routes>
    </Router>
  );
};

export default App;

