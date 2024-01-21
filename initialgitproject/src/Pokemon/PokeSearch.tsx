import { TextField, Toggle } from "office-ui-fabric-react";
import "./Pokemon.css";

interface PokeSearchProps {
  OnToggleChange: any;
}

export default function PokeSearch(props: PokeSearchProps) {
  return (
    <div className="searchPanel mrg" style={{borderRadius : "10px"}}>
      <div className="row mrg_10 pad_top_10 ">
        <Toggle
          className="mrg"
          title="mrg"
          onText="List View"
          offText="List View"
          onChange={props.OnToggleChange}
        ></Toggle>
      </div>
      <div className="row">
        <TextField className="col-md-4" label="Search By Text"></TextField>

      </div>
    </div>
  );
}
