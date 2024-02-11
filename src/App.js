import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {

  const [data, setData] = useState({});

  useEffect(() => {
      axios.get('http://localhost:9000')
          .then(response => {
              setData(response.data);
          })
          .catch(error => {
              console.error('Ошибка запроса:', error);
          });
  }, []);
  return (
    <div className="App">
      <img src={require('./assets/images/lana.jpg')}/>
      <img src={require('./assets/images/lox.jpg')}/> 
    </div>
  );
}

export default App;
