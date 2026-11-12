import type { IconType } from "react-icons"
import "./titleBar.css"

type TitleBarProps = {
   icon: IconType,
   title: string
}


/*
   "icon: Icon" é a mesma coisa de fazer


   function TitleBar({icon}:TitleBarProps){
      const Icon = icon
   }

   Icon será um componente que receberá o valor de icon
*/

export default function TitleBar({ icon: Icon, title }: TitleBarProps) {
   return (
      <div className="TitleBar">
         <Icon size={30} color="black" aria-hidden='false'></Icon>
         <h1>{title}</h1>
      </div>
   )
}