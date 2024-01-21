import React from 'react';
import Pokemon from './Pokemon/Pokemon';

interface ContainerProps {
    Component : string
}

const props = {Component : ""} as ContainerProps
 
 function Container(props : ContainerProps){

   const GetRenderComponent = () => {
        switch(props.Component){
            case ("Pokemon") : return (<Pokemon></Pokemon>)
        }
   }

return (
    <>
      {GetRenderComponent()}
    </>
)

}

export default Container