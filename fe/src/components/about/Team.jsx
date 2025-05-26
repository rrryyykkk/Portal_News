const team = [
  {
    id: 1,
    name: "John Doe",
    img: "avatar/01.jpg",
    position: "CEO",
  },
  {
    id: 2,
    name: "Joni Doe",
    img: "avatar/02.jpg",
    position: "CTO",
  },
  {
    id: 3,
    name: "Johan Doe",
    img: "avatar/03.jpg",
    position: "CFO",
  },
  {
    id: 4,
    name: "Jihan Doe",
    img: "avatar/04.jpg",
    position: "Programmer",
  },
  {
    id: 5,
    name: "Jihan OI",
    img: "avatar/05.jpg",
    position: "Designer",
  },
  {
    id: 6,
    name: "Jaen OI",
    img: "avatar/06.jpg",
    position: "Programmer",
  },
];

const Team = () => {
  return (
    <section className="grid grid-cols-1 bg-gray-100 mb-5">
      <div className="flex p-5 m-2 gap-2">
        <div className="flex h-4 w-1 bg-[var(--primary-color)] mt-2"></div>
        <h2 className="text-2xl font-bold">Mega News Team</h2>
      </div>
      <div className=" justify-between grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {team.map((team) => (
          <div
            className="flex flex-col items-center gap-3 p-10  bg-white rounded-2xl"
            key={team.id}
          >
            <div className="w-30">
              <img src={team.img} alt="avatar" className="rounded-xl" />
            </div>
            <div className="flex flex-col text-center gap-2 ">
              <p>{team.position}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-lg ">
              <h2 className="text-lg font-bold rounded-lg px-5 py-2">
                {team.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
