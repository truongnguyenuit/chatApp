import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { configRouter } from './router/configRouter';

import ProtectedRoute from "./router/protectedRouter";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {configRouter.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                element={
                  <ProtectedRoute protect={item.private} admin={item.admin}>
                    {item.page}
                  </ProtectedRoute>
                }
              />
            );
          }
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
