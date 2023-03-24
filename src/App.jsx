import { useState } from "react";
import Navbar from "./components/Digitization/navbar/Navbar";
import Add from "./pages/Digitization/Add";
import Search from "./pages/Digitization/Search";
import Help from "./pages/Digitization/Help";
import Login from "./pages/Login/Login";
import AppGallery from "./pages/AppGallery/AppGallery";
import PreviewLocalFile from "./components/Digitization/display/PreviewLocalFile";

import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";
import { FILE_UPLOAD_SIZE_LIMIT } from "./GLOBAL_VARS";

function App() {
  const auth = useAuth();
  return (
    <>
      {/* <PreviewLocalFile></PreviewLocalFile> */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/AppGallery" element={<AppGallery />} />

          <Route
            path="/digitization/*"
            element={
              //<RequireAuth>
              <Navbar />
              //</RequireAuth>
            }
          >
            <Route index element={<Navigate to="search" />} />
            <Route path="*" element={<Navigate to="search" />} />
            <Route path="search" element={<Search />} />
            <Route path="add" element={<Add />} />
            <Route path="help" element={<Help />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
