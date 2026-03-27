import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
 
function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>        
      </Routes>
    </BrowserRouter>
  );
}
export default App
