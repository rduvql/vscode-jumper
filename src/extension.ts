import * as vscode from "vscode";
import { jumperCommands } from "./commands";

const STATE_PREVIOUS_VERSION_NUM = "STATE_PREVIOUS_VERSION";

export function activate( context: vscode.ExtensionContext )
{
    jumperCommands.registerCommands( context );

    let jumper = vscode.extensions.getExtension( "rduvql.vscode-jumper" );

    let currentVersion = parseInt( ( jumper.packageJSON.version as string ).replace( /\./g, "" ) );
    // let previousVersion = context.workspaceState.get<number>( STATE_PREVIOUS_VERSION_NUM );


    context.workspaceState.update( STATE_PREVIOUS_VERSION_NUM, currentVersion );
}

export function deactivate() { }
