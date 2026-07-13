import Background from "./Background";

import Navbar from "./Navbar";

interface Props{

children:React.ReactNode;

}

export default function Layout({

children,

}:Props){

return(

<>

<Background/>

<Navbar/>

<main>

{children}

</main>

</>

);

}