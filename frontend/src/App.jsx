import './App.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import TextEditor from './Components/TextEditorPage'
import HomePage from './Components/home'
import LoginPage from './Components/loginpage'
import { RecoilRoot } from 'recoil'



function App() {

  return (
        <BrowserRouter>
        <RecoilRoot>
          <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='login' element={<LoginPage />} />
              <Route path='TextEditor' element={<TextEditor />} />
          </Routes>
        </RecoilRoot>
        </BrowserRouter>
  )
}

export default App
