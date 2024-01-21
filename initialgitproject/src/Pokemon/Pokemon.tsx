import { useEffect, useRef, useState } from "react";
import {
  PerformGetRequest,
  PerformPostRequest,
  PerformMultipleRequest,
} from "../Common/AxioxEx";
import "./Pokemon.css";
import {
  DetailsList,
  Dropdown,
  IColumn,
  IDropdownOption,
  SelectionMode,
  TextField,
  TooltipHost,
} from "office-ui-fabric-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import ConfirmationEx from "../CustomDialog/ConfirmDialog";
import userEvent from "@testing-library/user-event";
import ImageUpload from "../Common/ImageUpload";

interface PokemonState {
  IsAddFormVisible: boolean;
  PokeData: Array<any>;
  SelectedPokemon: Pokemon;
  PokemonTypes: Array<{ key: number; text: string }>;
}

interface Pokemon {
  Id: number;
  Name: string;
  Description: string;
  SelectedPokemonTypes: Array<number>;
  IsActive: boolean;
  NameErrorMsg: string;
  TypeErrorMsg: string;
}

const InitialPokemon = {
  Id: 0,
  Name: "",
  Description: "",
  SelectedPokemonTypes: [],
  IsActive: true,
  NameErrorMsg: "",
  TypeErrorMsg: "",
} as Pokemon;

const InitialPokeSate: PokemonState = {
  IsAddFormVisible: false,
  PokeData: [],
  SelectedPokemon: InitialPokemon,
  PokemonTypes: [],
};

function Pokemon() {
  const [AllPokemonsState, SetPokemons] = useState(InitialPokeSate);

  useEffect(() => {
    GetAllPokemons();
  }, []);

  function GetAllPokemons() {
    //PerformGetRequest("https://localhost:7027/Pokemon/GetPokemons", OnGetAllPokemons,OnError)

    let endpoint = [
      { url: "https://localhost:7027/Pokemon/GetPokemons" },
      { url: "https://localhost:7027/Pokemon/GetPokemonTypes" },
    ];
    PerformMultipleRequest(endpoint, OnGetAllPokemons, OnError);
  }

  function OnGetAllPokemons(res: any) {
    let currentState = {
      ...AllPokemonsState,
      PokeData: res[0] ? res[0].data : [],
      PokemonTypes: res[1]
        ? res[1].data.map((item: any) => {
            return { key: item.id, text: item.name };
          })
        : [],
      IsAddFormVisible: false,
      SelectedPokemon: InitialPokemon,
    } as PokemonState;
    SetPokemons(currentState);
  }

  function OnError() {}

  function OnAddPokemonClick() {
    let currentState = {
      ...AllPokemonsState,
      IsAddFormVisible: !AllPokemonsState.IsAddFormVisible,
    } as PokemonState;
    SetPokemons(currentState);
  }

  function OnBackClick() {
    let currentState = {
      ...AllPokemonsState,
      IsAddFormVisible: false,
      SelectedPokemon: InitialPokemon,
    } as PokemonState;
    SetPokemons(currentState);
  }

  function OnNameChange(e: any) {
    let text = e.target.value;
    let errorMsg = NameValidator(text);

    let selectedPokemon = AllPokemonsState.SelectedPokemon;
    let currentState = {
      ...AllPokemonsState,
      SelectedPokemon: {
        ...selectedPokemon,
        NameErrorMsg: errorMsg,
        Name: e.target.value,
      },
    } as PokemonState;
    SetPokemons(currentState);
  }

  function NameValidator(text: string) {
    let errorMsg = "";
    if (text.trim() === "") {
      errorMsg = "Field is mandatory.";
    } else if (text.trim().length > 255 || text.trim().length < 3) {
      errorMsg = "Entered text must be between 3 and 255 characters";
    }

    let allPokeNames = AllPokemonsState.PokeData.filter(
      (p) => p.id != AllPokemonsState.SelectedPokemon.Id
    ).map((p: any) => {
      return p.name;
    });
    if (allPokeNames.filter((p) => p == text.trim()).length > 0) {
      errorMsg = "Name Must Be Unique";
    }
    return errorMsg;
  }

  function OnDescriptionChange(e: any) {
    let selectedPokemon = AllPokemonsState.SelectedPokemon;
    let currentState = {
      ...AllPokemonsState,
      SelectedPokemon: {
        ...selectedPokemon,
        Description: e.target.value,
      },
    } as PokemonState;
    SetPokemons(currentState);
  }

  function OnTypeChange(event: any, item: IDropdownOption) {
    let selectedPokemon = AllPokemonsState.SelectedPokemon;
    let currentItems = [...selectedPokemon.SelectedPokemonTypes];
    let index = currentItems.indexOf(+item.key);
    if (index == -1) {
      currentItems.push(+item.key);
    } else {
      currentItems.splice(index, 1);
    }
    let currentState = {
      ...AllPokemonsState,
      SelectedPokemon: {
        ...selectedPokemon,
        SelectedPokemonTypes: currentItems,
        TypeErrorMsg:
          currentItems.length == 0 ? "Select at least one value" : "",
      },
    } as PokemonState;
    SetPokemons(currentState);
  }

  function OnRenderColumn(
    item: any,
    index: number | undefined,
    column: IColumn | undefined
  ): any {
    if (column.fieldName == "Name") {
      return (
        <div>
          <div>
            <h5 className=" font_normal">{item.name}</h5>
          </div>
        </div>
      );
    } else if (column.fieldName == "Description") {
      return (
        <div>
          <div>
            <h5 className=" font_normal">{item.description}</h5>
          </div>
        </div>
      );
    } else if (column.fieldName == "Action") {
      return (
        <div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              OnEdit(item);
            }}
          >
            Edit
          </button>

          <button
            className="mrg_lft_rgt_5 btn btn-outline-primary btn-sm"
            onClick={() => {
              OnDelete(item);
            }}
          >
            Delete
          </button>
        </div>
      );
    } else if (column.fieldName == "Type") {
      let types = [];
      item.pokemonTypeMappings.map((type: any) => {
        let specificType = AllPokemonsState.PokemonTypes.find(
          (masterType: any) => {
            return type.typeId == masterType.key;
          }
        );
        if (specificType) {
          types.push(specificType.text);
        }
      });
      return <h5>{types.toString()}</h5>;
    }
  }

  function OnDelete(pokemon: Pokemon) {
    let data = { ...pokemon, IsActive: false } as Pokemon;
    PerformPostRequest(
      "https://localhost:7027/Pokemon/DeletePokemon",
      GetAllPokemons,
      OnError,
      data
    );
  }

  function OnSave() {
    if (FormValidator()) {
      let data = {
        Id: AllPokemonsState.SelectedPokemon.Id,
        Name: AllPokemonsState.SelectedPokemon.Name,
        IsActive: true,
        Description: AllPokemonsState.SelectedPokemon.Description,
        PokemonTypeMappings:
          AllPokemonsState.SelectedPokemon.SelectedPokemonTypes.map(
            (key: number) => {
              return {
                PokemonId: AllPokemonsState.SelectedPokemon.Id,
                TypeId: key,
              };
            }
          ),
      };
      PerformPostRequest(
        "https://localhost:7027/Pokemon/PostPokemon",
        GetAllPokemons,
        OnError,
        data
      );
    }
  }

  function FormValidator() {
    let selectedPokemon = AllPokemonsState.SelectedPokemon;
    let isValid = true;

    let nameMsg = NameValidator(selectedPokemon.Name);
    isValid = nameMsg == "" ? true : false;

    isValid = selectedPokemon.SelectedPokemonTypes.length == 0 ? false : true;
    return isValid;
  }

  function OnEdit(pokemon: any) {
    SetPokemons((prevState) => {
      return {
        ...prevState,
        SelectedPokemon: {
          Id: pokemon.id,
          Name: pokemon.name,
          Description: pokemon.description,
          SelectedPokemonTypes: pokemon.pokemonTypeMappings.map((item: any) => {
            return item.typeId;
          }),
          IsActive: true,
        } as Pokemon,
        IsAddFormVisible: true,
      } as PokemonState;
    });
  }
  return (
    <div>
      <ConfirmationEx
        DisplayMessage=""
        Header=""
        button1={() => {
          alert("accept");
        }}
        button2={() => {
          alert("reject");
        }}
      />
      <div className="row">
        {AllPokemonsState.IsAddFormVisible ? (
          <>
            <button
              className="col-md-2 btn btn-outline-primary btn-sm"
              onClick={() => {
                OnBackClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chevron-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                />
              </svg>
              Back
            </button>
          </>
        ) : (
          <button
            className="col-md-2 btn btn-outline-primary btn-sm"
            onClick={() => {
              OnAddPokemonClick();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
              />
            </svg>
            Add New Pokemon
          </button>
        )}
      </div>
      {AllPokemonsState.IsAddFormVisible ? (
        <div className="col-md-12">
          <div className="row col-md-2 mrg_10">
            <label className="ms-Label">
              Name <span style={{ color: "red" }}>(Mandatory)</span>
            </label>
            <TooltipHost content={"Name"} className="col-md-6">
              <TextField
                errorMessage={AllPokemonsState.SelectedPokemon.NameErrorMsg}
                className=""
                onChange={OnNameChange}
                value={AllPokemonsState.SelectedPokemon.Name}
              ></TextField>
            </TooltipHost>
          </div>
          <div className="row col-md-2 mrg_10">
            <label className="ms-Label">Description</label>

            <TooltipHost content={"Description"}>
              <TextField
                className=""
                multiline={true}
                value={AllPokemonsState.SelectedPokemon.Description}
                rows={10}
                onChange={OnDescriptionChange}
              ></TextField>
            </TooltipHost>
          </div>
          <div className="row col-md-2 mrg">
            <label className="ms-Label">Type</label>
            <Dropdown
              options={AllPokemonsState.PokemonTypes}
              selectedKeys={
                AllPokemonsState.SelectedPokemon.SelectedPokemonTypes
              }
              placeholder="Select Type"
              onChange={OnTypeChange}
              multiSelect={true}
              errorMessage={AllPokemonsState.SelectedPokemon.TypeErrorMsg}
            ></Dropdown>
          </div>
          {/* <div className="row">
                    <ImageUpload></ImageUpload>
                </div> */}

          <div>
            <button className="btn btn-primary btn-sm" onClick={OnSave}>
              SAVE
            </button>
          </div>
        </div>
      ) : (
        <DetailsList
          items={AllPokemonsState.PokeData}
          selectionMode={SelectionMode.none}
          onRenderItemColumn={OnRenderColumn}
          columns={Columns}
        ></DetailsList>
      )}
    </div>
  );
}

export default Pokemon;

const Columns = [
  {
    key: "column0",
    name: "Name",
    fieldName: "Name",
    minWidth: 200,
    maxWidth: 200,
    isResizable: false,
  },
  {
    key: "column1",
    name: "Description",
    fieldName: "Description",
    minWidth: 300,
    maxWidth: 300,
    isResizable: false,
  },
  {
    key: "column2",
    name: "Type",
    fieldName: "Type",
    minWidth: 150,
    maxWidth: 150,
    isResizable: false,
  },
  {
    key: "column3",
    name: "Action",
    fieldName: "Action",
    minWidth: 50,
    maxWidth: 50,
    isResizable: false,
  },
];
