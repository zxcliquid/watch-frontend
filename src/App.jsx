import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './components/Room'; // Импорт компонента комнаты

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />  {/* Это маршрут для комнаты */}
      </Routes>
    </Router>
  );
};

export default App;

