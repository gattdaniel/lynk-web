import { addDoc, collection,  deleteDoc,  doc,  getDocs, orderBy, query, serverTimestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../services/Firebase"

export default function Privateroom(){
    const [state, setState]=useState("")
    const [room, setRoom]=useState([])

    // function d'ajout de task
    const HandleAdddoc=async(e)=>{
       e.preventDefault()
       if(!state.trim())return
       try{
        await addDoc(collection(db, "privateRoom"),{
            state: state,
            timestamp: serverTimestamp()
        });
        setState("");
        fetchprivateroom();
       }catch(error){
        console.error(error)
       }
    }

    // function de surppression de task
  const handledelete=async(id)=>{
    try{
      await deleteDoc(doc(db, 'privateroom', id))
      fetchprivateroom()
    }catch(error){
      console.log(error)
    }
  }  

   // fonction de récupération des données
    const fetchprivateroom=async()=>{
        try{
            const q= query(collection(db, "privateRoom"), orderBy("Timestamp", "desc"))
            const querysnapshot = await getDocs(q)
            const privateRoom= querysnapshot.docs.map((doc)=>({
                id:doc.id,
                ...doc.data
            }))
            setRoom(privateRoom)
            return privateRoom
        }catch(error){
            console.error(error)
        }
    }
     // appel de la function au prmier chargement
      useEffect(() => {
        fetchprivateroom();
      }, []);
    return(
        <>
             <form
          onSubmit={HandleAdddoc}
          className="w-[100vh] flex fixed bottom-0 left-1/2  transform -translate-x-1/2 items-center gap-2 bg-[#204b57] p-4 rounded-xl shadow-md"
        >
          <input
            type="text"
            placeholder="Entrez un message"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="flex-1 px-4 py-2   bg-[#0b525b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0b525b] text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <img src="fleche.png" alt="Ajouter" className="w-5 h-5" />
          </button>
        </form>
          <div className="h-[75vh]   w-[65vw] overflow-y-auto custom-scrollbar1 px-4 py-2 ">
          {room.map((notif) => (
            <div
              key={notif.id}
              className="mb-2 p-4 bg-[#204b57] rounded-lg shadow-sm border hover:bg-[#0b525b]"
            >
              <p className="text-gray-800 ">{notif.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notif.timestamp?.toDate()).toLocaleString()}
              </p>
              <button onClick={() => handledelete(notif.id)}>supprimer</button>
            </div>
          ))}
        </div>
        </>
    )
}