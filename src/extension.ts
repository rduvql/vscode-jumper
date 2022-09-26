import * as vscode from "vscode";
import { jumperCommands } from "./commands";

const STATE_PREVIOUS_VERSION_NUM = "STATE_PREVIOUS_VERSION";

export function activate( context: vscode.ExtensionContext )
{
    jumperCommands.registerCommands( context );

    // vscode.window.showInformationMessage("ready")
    // checkVersion( context );
}

export function deactivate() { }


// function checkVersion( context: vscode.ExtensionContext ) {

//     let jumperExt = vscode.extensions.getExtension( "rduvql.vscode-jumper" );

//     let previousVersion = context.workspaceState.get<number>( STATE_PREVIOUS_VERSION_NUM );
//     let currentVersion = parseInt( ( jumperExt.packageJSON.version as string ).replace( /\./g, "" ) );

//     if ( !previousVersion || previousVersion < currentVersion ) {
//         vscode.window.showInformationMessage( "vscode-jumper has been updated ! more informations on extension's page" );
//     }

//     context.workspaceState.update( STATE_PREVIOUS_VERSION_NUM, currentVersion );
// }
