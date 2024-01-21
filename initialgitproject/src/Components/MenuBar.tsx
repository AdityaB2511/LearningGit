import "./Menubar.css"

const Items = [{label:"Pokemon"}]

export default function MenuBar(){
  return(
    <div className="MenuBar">
     <ul style={{listStyleType:"none"}}>
        {
            Items.map((item:any)=>{
                return(
                    <li key={item.label} className="MenubarItem">{item.label}</li>
                )
            })
        }
     </ul>
    </div>
  )
}
        