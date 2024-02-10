import { useForm } from "react-hook-form";
import { contact } from "../../data/contact";

const Contact = () => {
    const {
        register,
        handleSubmit
    } = useForm()

    return ( 
        <section className="contact mt-10 bg-white py-4">
            <h2 className="text-white text-3xl font-bold text-center text-black py-4">Contact</h2>
            <p className="w-11/12 mx-auto mb-8">I would love to hear about your project and how I could help.
              Please fill in the form, and I`ll get back to you as soon as
              possible.</p>
            <form className="px-4 flex flex-col items-center" onSubmit={handleSubmit((data) => contact(data))}>
                <input className="block border-b-2 mb-4 w-96 p-4 md:text-center focus:outline-none" type="text" placeholder="Your Name" {...register("name")}/>
                <input className="block border-b-2 mb-4 w-96 p-4 md:text-center focus:outline-none" type="email" placeholder="Your Email" {...register("email")}/>
                <textarea className="border-b-2 mb-4 w-96 p-4 md:text-center focus:outline-none" name="message" id="message" cols="20" rows="5" placeholder="Message" {...register("message")}></textarea>
                <button className="mt-8 block text-center mt-4 uppercase font-bold tracking-wider border-b-4 border-violet-800 hover:text-violet-800 w-32 mx-auto sm:ml-auto py-2" type="submit">Send Message</button>
            </form>
        </section>
     );
}
 
export default Contact;