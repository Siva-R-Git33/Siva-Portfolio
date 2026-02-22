import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Certifications from '../sections/Certifications';
import Blog from '../sections/Blog';
import Contact from '../sections/Contact';

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Certifications />
            <Blog />
            <Contact />
        </main>
    );
}
