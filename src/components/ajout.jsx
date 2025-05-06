import { useEffect, useRef, useState } from "react";

export default function Ajout({addTask}) {
    const [taches, setTaches] = useState("");
    const input = useRef()

const ajouterTache = (e) => {
    e.preventDefault();
    if (taches) {
        addTask(taches); 
        setTaches(""); 
      }
}
useEffect(()=>{
    input.current.focus();
},[taches])
  return (
    <>
      <div className="flex justify-center items-center bg-neutral-200 mt-16 mx-40 px-4 py-1">
        <div className="container mx-5 my-1">
          <input
            type="text"
            ref={input}
            value={taches}
            onChange={(e) => setTaches(e.target.value)}
            placeholder="Que souhaitez-vous ajoute?"
            className=" container text-black  mx-3 my-5 py-1 rounded-full"
          />
        </div>
        <button
          className="bg-blue-400 text-white px-5 py-1 rounded hover:bg-orange-600 transition duration-300"
        onClick={ajouterTache}>
          add
        </button>
      </div>
    </>
  );
}
