import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { initialProperties } from './data/mockData';

function App() {
  const [properties, setProperties] = useState(initialProperties);

  const handleAddListing = (newListing) => {
    setProperties(prev => [newListing, ...prev]);
  };

  const handleDeleteListing = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateListing = (updatedListing) => {
    setProperties(prev => prev.map(p => p.id === updatedListing.id ? updatedListing : p));
  };

  const handlePropertyView = (id) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id && p.status !== 'sold') {
        return { ...p, views: (p.views || 0) + 1 };
      }
      return p;
    }));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage properties={properties} onPropertyView={handlePropertyView} />} />
        <Route
          path="/admin"
          element={
            <AdminPage
              properties={properties}
              onAddListing={handleAddListing}
              onDeleteListing={handleDeleteListing}
              onUpdateListing={handleUpdateListing}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
