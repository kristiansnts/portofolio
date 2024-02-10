import gitIcon from '../../assets/icon-github.svg'
import linkedIn from '../../assets/icon-linkedin.svg'

const Header = () => {
    return ( 
        <header className="px-5 py-3 flex flex-col w-10/12 mx-auto sm:flex-row justify-between ">
        <h1 className="text-white text-3xl font-bold text-center">KristianS</h1>
        <div className="contact flex justify-center gap-3 mt-3">
            <a href="https://github.com/kristiansnts"><img src={gitIcon} alt="" /></a>
            <a href="https://www.linkedin.com/in/kristian-santoso"><img src={linkedIn} alt="" /></a>
        </div>
      </header>
     );
}

export default Header;