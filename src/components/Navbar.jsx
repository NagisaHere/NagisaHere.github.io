import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 text-white mix-blend-difference">
      <div className="text-xl font-bold tracking-widest uppercase">
        MY PORTFOLIO
      </div>
      
      <div className="flex gap-6 text-2xl">
        <a 
            href="https://github.com/NagisaHere" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
        >
            <FaGithub />
        </a>
        <a 
            href="https://linkedin.com/in/ryan-wang-287909266/"
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
        >
            <FaLinkedinIn />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
