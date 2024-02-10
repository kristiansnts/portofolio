import ring from "../../assets/pattern-rings.svg"
import { skill } from "../../data/skills";

const Skills = () => {
    return ( 
        <section className="skills grid sm:grid-cols-2 md:grid-cols-4 text-center text-white my-10 border-b-2 w-11/12 pb-5 mx-auto">
          {skill.map((skill, index) => (
                <div key={index} className="skill__item mb-5">
                    <h3 className="text-3xl font-bold p-1">{skill.language}</h3>
                    <p>{skill.exp} Years Experience</p>
                </div>
            ))}
            <img src={ring} alt="" className="ring-right"/>
        </section>
     );
}
 
export default Skills;