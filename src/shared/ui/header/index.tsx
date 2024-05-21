import reactLogo from "/react.png";

export function Header() {
  return (
    <header className="flex items-center justify-center">
      <img className="w-36 h-30" src={reactLogo} alt="React" />
      <h1 className="uppercase font-bold text-6xl ml-8 bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
        The React Quiz
      </h1>
    </header>
  );
}
