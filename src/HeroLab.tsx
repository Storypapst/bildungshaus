import {createRoot} from 'react-dom/client'
import {useState} from 'react'
import {Moon,Sun} from 'lucide-react'
import {Button} from './components/ui/button'
import EditorialHero from './EditorialHero'
import './index.css'
function Preview(){const[dark,setDark]=useState(false);return <><header className="masthead"><a className="wordmark" href={import.meta.env.BASE_URL}>bildungshaus weWeit</a><Button variant="outline" onClick={()=>{setDark(!dark);document.documentElement.classList.toggle('dark',!dark)}}>{dark?<Sun/>:<Moon/>}{dark?'Helles Design':'Dunkles Design'}</Button></header><main><EditorialHero/></main></>}
createRoot(document.getElementById('root')!).render(<Preview/> )
