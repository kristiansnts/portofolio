import "./App.css"
import Header from "./component/Header/Header"
import Banner from "./component/Banner/Banner"
import Skills from "./component/Skills/Skills"
import Projects from "./component/Projects/Projects"
import Contact from "./component/Contact/Contact"

function App() {
  return (
    <>
      <Header />
      <main>
        <Banner />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default App
