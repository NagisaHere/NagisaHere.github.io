const HeroOverlay = () => {
  return (
    // pointer-events-none allows clicks to pass through text to the 3D model behind it
    // UNLESS clicking a button/link which needs pointer-events-auto
    <main className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center px-8 md:px-24 pointer-events-none text-white">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter">
          SOFTWARE <br /> 
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">
            DEVELOPER
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
           Here to have fun.
        </p>
        
        <a
          href="/blog"
          className="pointer-events-auto inline-block rounded-full bg-primary px-8 py-3 font-bold text-darkbg transition-all duration-300 hover:bg-white"
        >
          View Blogs
        </a>
      </div>
    </main>
  );
};

export default HeroOverlay;
