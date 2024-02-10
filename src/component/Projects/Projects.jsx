import { contact } from "../../data/contact";
import { projects } from "../../data/projects";

const Projects = () => {
    return ( 
        <section className="projects mt-10 text-white">
            <h2 className="text-white text-3xl font-bold text-center py-4 mb-3">Projects</h2>
            <a onClick={contact} className="block text-center text-white uppercase font-bold tracking-widest border-b-4 border-violet-800 p-2 w-36 mx-auto hover:text-violet-800 mb-20">Contact Me</a>
            <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                  <li key={index} className="mb-4">
                    <img src={project.img} alt={project.title} className="w-11/12 mx-auto h-auto"/>
                    <h3 className="text-white text-3xl font-bold text-center py-2 mt-4">{project.title}</h3>
                    <p className="flex gap-4 justify-center text-md">
                      {project.tools.map((tool, idx) => (
                        <span key={idx}>{tool}</span>
                      ))}
                        
                        <span>API</span>
                    </p>
                    <div className="links mt-4">
                        <a href={project.demo} className="block text-center mt-4 uppercase font-bold tracking-wider border-b-4 border-violet-800 hover:text-violet-800 w-32 mx-auto py-2">View Project</a>
                        <a href={project.link} className="block text-center mt-4 uppercase font-bold tracking-wider border-b-4 border-violet-800 hover:text-violet-800 w-32 mx-auto py-2">View Code</a>
                    </div>
                </li>
              ))}
            </ul>
        </section>
     );
}
 
export default Projects;