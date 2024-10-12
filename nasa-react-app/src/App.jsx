import Footer from "./components/Footer"
import SideBar from "./components/SideBar"
import Main from "./components/Main"
import { useEffect, useState } from 'react'

function App() {
 
  const [ data,setData] = useState(null)

  const [loading,setLoading] = useState(false)

  const NASA_KEY = import.meta.env.VITE_NASA_API_KEY

   const [ showModal, setShowModal] = useState(false)
   

   function  handleToggleModal() {
    setShowModal(!showModal)
   }

   useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY

      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`;

      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`


      const cachedData = localStorage.getItem(localKey);
      if (cachedData) {
        try {
          const apiData = JSON.parse(cachedData); // Ensure you're parsing JSON correctly
          setData(apiData);
          setLoading(false);
          console.log('Fetched from cache today');
          return;
        } catch (error) {
          console.error("Failed to parse cached data:", error);
          // If parsing fails, you might want to clear this item
          localStorage.removeItem(localKey);
        }
      }

      try {
        const res = await fetch(url);
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData)); // Ensure the data is stringified
        setData(apiData);
        console.log('Fetched from API today');
      } catch (err) {
        console.error(err.message);
        // Optionally handle error state here
      } finally {
        setLoading(false); // Update loading state after API call
      }
    }



    
     fetchAPIData();
   }, [])

  return (
   <>
       {data ? (<Main data= { data} />) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
       )}
       {showModal && <SideBar data={ data } handleToggleModal={handleToggleModal}/>} 
       {data && (<Footer data= { data} handleToggleModal={handleToggleModal} />)}
       </>
  )
}

export default App



