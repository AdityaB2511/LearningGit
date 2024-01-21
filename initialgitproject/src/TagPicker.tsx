import { ITag, TagPicker } from "office-ui-fabric-react";
import React from "react";

export class ReactTagPicker extends React.Component<any,any>{

    private _onFilterChanged = (filterText: string, tagList?: ITag[]): ITag[] => {
        debugger;
        return [{ key: filterText, name: filterText, isNewItem: true } as ITag];
    }

    render(): React.ReactNode {
        return(
            <TagPicker
            onResolveSuggestions={this._onFilterChanged.bind(this)}
            />

        )
    }
}