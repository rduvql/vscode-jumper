// import * as vscode from "vscode";

// "contribute: {"
// "configuration": {
//     "title": "vscode-jumper configuration",
//     "properties": {
//         "vscode-jumper.lineStartRegexp": {
//             "type": "string",
//             "description": "regexp test"
//         }
//     }
// },
// let configuration = vscode.workspace.getConfiguration( "vscode-jumper" );
// let lineStartRegexpCfg: string = configuration.get( "lineStartRegexp" );
// let lineStartRegexp = ( lineStartRegexpCfg && new RegExp( lineStartRegexpCfg ) ) || /^[a-zA-Z]{2,}/;

// // EXPLORER

// registerDisposableCommand( "test", () =>
// {
//     const explore = ( currentFolder ) =>
//     {
//         let a = readdirSync( currentFolder ).map( d => {
//             let fileordirpath = join( currentFolder, d );
//             return statSync( fileordirpath ).isDirectory() ? `${d}/` : basename( fileordirpath );
//         } );

//         let quickpick = vscode.window.createQuickPick();

//         // quickpick.onDidChangeActive( e => {
//         //     console.log( `onDidChangeActive`, e );

//         // } );

//     //     quickpick.onDidChangeSelection( e => {
//     //         console.log( `onDidChangeSelection`, e );
//     // } );
//         // quickpick.onDidChangeValue( e => {
//         //     console.log( "ondidchangevalue" );
//         // } );

//         quickpick.onDidAccept( e => {
//             console.log( "onDidAccept", quickpick.selectedItems );

//             quickpick.value = join( quickpick.selectedItems[0].label ).replace( "\\", "/" );
//             // quickpick.dispose();
//             // explore( join( currentFolder, quickpick.selectedItems[0].label ) );
//         } );

//         quickpick.value = `${currentFolder}/`;
//         quickpick.canSelectMany = false;
//         quickpick.items = [{label: ""}].concat( a.map( name => ( {label: join( currentFolder, name ).replace( "\\", "/" ), alwaysShow: true } ) ) );
//         quickpick.show();
//     };

//     explore( "D:/projects" );
// } );
















// export const logger = ( () => {

//     let output: vscode.OutputChannel;

//     function init( name: string ) {
//         if ( !output ) {
//             output = vscode.window.createOutputChannel( name );
//         }
//     }

//     function log( value: string ) {
//         output && output.appendLine( value );
//     }

//     return {
//         init: init,
//         log: log
//     };
// } )();


// /*
//     TEXT DECORATION
// */
// const decorationType = vscode.window.createTextEditorDecorationType( {
//     after: {
//         contentText: "test"
//     }
//   } );

// let editor = vscode.window.activeTextEditor;

// if ( editor )
// {
//     const sourceCodeArr = editor.document.getText().split( "\n" );
//     let decorationsArray = [];
//     for ( let line = 0; line < sourceCodeArr.length; line++ ) {
//         let match = sourceCodeArr[line].match( /(let)/ );

//         if ( match !== null && match.index !== undefined ) {
//             let range = new vscode.Range(
//                 new vscode.Position( line, match.index ),
//                 new vscode.Position( line, match.index + match[1].length )
//             );

//             decorationsArray.push( { range } );
//         }
//     }

//     editor.setDecorations( decorationType, decorationsArray );
// }




// /*
//     DYNAMIC QUICKPICK
// */
// let qp = vscode.window.createQuickPick();
// qp.value = "/";

// qp.items = fs.readdirSync( "/" )
//     .map( str =>  ( {label: "/" + str, description: "", alwaysShow: false, detail: "", picked: false} ) );

// qp.onDidAccept( ( e ) =>
// {
//     qp.items = fs.readdirSync( qp.value )
//         .map( str =>  ( {
//             label: ( qp.selectedItems[0].label + "/" + str ).replace( /\/\//g, "/" ),
//             description: "",
//             alwaysShow: false,
//             detail: "",
//             picked: false} )
//         );

//     qp.value = qp.selectedItems[0].label;
// } );

// qp.onDidChangeValue( e => {
//     console.log( e );
// } );

// qp.show();





// /*
//     LOAD HTML
// */

// let url = context.asAbsolutePath( path.join( "src/webviews/index.html" ) );
// console.log( url );

// vscode.workspace.openTextDocument( url ).then( doc =>
// {
//     let panel = vscode.window.createWebviewPanel( "html", "vscode-jumper", vscode.ViewColumn.Active );
//     panel.webview.html = doc.getText();
//     panel.reveal();
// } );




// registerDisposableCommand( "ext.jumper.deleteCurrentWord", () =>
// {
//     let separator = vscode.workspace.getConfiguration().get( "editor.wordSeparators" ) as string;

//     let editor = vscode.window.activeTextEditor;
//     let selection = editor.selection;
//     let position = editor.selection.start.character;

//     let currentLine = editor.document.lineAt( selection.start.line ).text;
//     let wordStart = position;
//     let wordEnd = position;

//     for ( let i = wordStart; i > 0; i-- ) {
//         let c = currentLine[i];
//         if ( `${separator} `.includes( c ) ) {
//             wordStart = i;
//             break;
//         }
//     }
//     for ( let i = wordEnd; i < currentLine.length; i++ ) {
//         let c = currentLine[i];
//         if ( `${separator} `.includes( c ) ) {
//             wordEnd = i;
//             break;
//         }
//     }

//     let range = new vscode.Range(
//         new vscode.Position( selection.start.line, wordStart + 1 ),
//         new vscode.Position( selection.start.line, wordEnd )
//     );

//     editor.edit( ( TextEditorEdit ) => {
//         TextEditorEdit.replace( range, "" );
//     } );

//     console.log( position );
// } )
