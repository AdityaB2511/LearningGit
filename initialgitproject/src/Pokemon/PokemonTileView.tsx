import "./Pokemon.css";

interface TileCardProps {
  Data: Array<any>;
}

export default function PokeTileView(props: TileCardProps) {
  return (
    <>
      {props.Data.length == 0 ? (
        <div>A</div>
      ) : (
        <div style={{display:"flex",flexWrap:"wrap",height : "500px",overflow:"scroll"}}>
          {props.Data.map((p: any) => {
            return (
              <div className="col-md-4 mrg" style={{float:"left"}}>
                <div className="card">
                  <div className="front">
                    <h4>{p.name}</h4>
                    <img
                      src={p.imageUrl}
                      style={{ width: "100px", height: "100px" }}
                    ></img>
                  </div>
                  <div className="back">
                    <h4>{p.description}</h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
