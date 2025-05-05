const Navbar = () => {
  return (
    <div className="flex flex-col items-center">
      <h1
        className="text-[var(--primary-color)] font-bold"
        style={{
          fontFamily: "var(--font-h1)",
          fontSize: "var(--size-h1)",
        }}
      >
        ZYnnn.news
      </h1>
      <hr className="border-t-2 border-black w-full mt-2" />
    </div>
  );
};

export default Navbar;
