import ring from "../../assets/pattern-rings.svg"
import circle from "../../assets/pattern-circle.svg"
import profile from "../../assets/profile-img2.png"
import { contact } from "../../data/contact";

const Banner = () => {
    return (
        <section className="banner my-4 border-b-2 w-11/12 pb-5 mx-auto ">
            <img src={ring} alt="" className="svg-ring"/>
            <img src={circle} alt="" className="circle"/>
            <div className="banner-in grid sm:grid-cols-2 mb-12">
                <div className="hero">
                  <img src={profile} alt="" className="w-3/4 mx-auto order-last"/>
                </div>
                <div className="headline self-center text-white text-center sm:order-last md:text-left my-5 w-10/12 mx-auto">
                  <h1 className="my-4 text-3xl font-bold">Nice to meet you! <br /> I`m <span className="border-b-4 border-violet-800">Kristian Santoso</span></h1>
                  <p className="leading-7 mb-4 text-lg">Passionate Front-End Developer, with good Problem Solving Skill and can implement design to code.</p>
                  <a onClick={contact} className="block text-center md:text-left text-white uppercase font-bold tracking-widest border-b-4 border-violet-800 p-2 w-36 mx-auto md:m-0 hover:text-violet-800 mb-4 cursor-pointer">Contact Me</a>
                </div>
            </div>
        </section>
     );
}
 
export default Banner;