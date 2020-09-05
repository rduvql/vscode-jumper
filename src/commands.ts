import * as vscode from "vscode";

type direction = "NEXT" | "PREV";

export const jumperCommands = ( () =>
{
    let context: vscode.ExtensionContext;

    function registerCommands( ctx: vscode.ExtensionContext )
    {
        context = ctx;

        const registerDisposableCommand = ( command: string, callback: ( ...args: any[] ) => any, thisArg?: any ) =>
        {
            let disposable = vscode.commands.registerCommand( command, callback, thisArg );
            context.subscriptions.push( disposable );
        };

        registerDisposableCommand( "ext.jumper.focusPrevious", () =>
        {
            let line = getNextOrPreviousLine( "PREV" );
            line && moveToStartOfTextLine( line );
        } );

        registerDisposableCommand( "ext.jumper.focusNext", () =>
        {
            let line = getNextOrPreviousLine( "NEXT" );
            line && moveToStartOfTextLine( line );
        } );

        registerDisposableCommand( "ext.jumper.focusPreviousError", () =>
        {
            let previousRange = getNextOrPreviousError( "PREV" );
            previousRange && moveToPosition( previousRange.start, previousRange.end );
        } );

        registerDisposableCommand( "ext.jumper.focusNextError", () =>
        {
            let nextRange = getNextOrPreviousError( "NEXT" );
            nextRange && moveToPosition( nextRange.start, nextRange.end );
        } );

        registerDisposableCommand( "ext.jumper.deleteCurrentWord", () =>
        {
            let separator = vscode.workspace.getConfiguration().get( "editor.wordSeparators" ) as string;

            let editor = vscode.window.activeTextEditor;
            let selection = editor.selection;
            let position = editor.selection.start.character;

            let currentLine = editor.document.lineAt( selection.start.line ).text;
            let wordStart = position;
            let wordEnd = position;

            for ( let i = wordStart; i > 0; i-- ) {
                let c = currentLine[i];
                if ( `${separator} `.includes( c ) ) {
                    wordStart = i;
                    break;
                }
            }
            for ( let i = wordEnd; i < currentLine.length; i++ ) {
                let c = currentLine[i];
                if ( `${separator} `.includes( c ) ) {
                    wordEnd = i;
                    break;
                }
            }

            let range = new vscode.Range(
                new vscode.Position( selection.start.line, wordStart + 1 ),
                new vscode.Position( selection.start.line, wordEnd )
            );

            editor.edit( ( TextEditorEdit ) => {
                TextEditorEdit.replace( range, "" );
            } );

            console.log( position );
        } );

        registerDisposableCommand( "ext.jumper.focusNextWordInLine", () =>
        {
            let indexes = getCurrentLineWordIndexes();
            let editor = vscode.window.activeTextEditor;
            let currLineNum = editor.selection.active.line;
            // let currentLine = editor.document.lineAt( currLineNum );
            let nextWords = indexes.filter( e => e.iWordStart > editor.selection.active.character );

            if ( nextWords[0] )
            {
                editor.selection = new vscode.Selection(
                    new vscode.Position( currLineNum, nextWords[0].iWordStart ),
                    new vscode.Position( currLineNum, nextWords[0].iWordEnd )
                );
            }
        } );

        registerDisposableCommand( "ext.jumper.focusPreviousWordInLine", () =>
        {
            let indexes = getCurrentLineWordIndexes();
            let editor = vscode.window.activeTextEditor;
            let currLineNum = editor.selection.active.line;
            // let currentLine = editor.document.lineAt( currLineNum );
            let nextWords = indexes.filter( e => e.iWordStart <= editor.selection.active.character ).reverse().slice( 1 );

            if ( nextWords[0] )
            {
                editor.selection = new vscode.Selection(
                    new vscode.Position( currLineNum, nextWords[0].iWordStart ),
                    new vscode.Position( currLineNum, nextWords[0].iWordEnd )
                );
            }
        } );
    }

    return {
        registerCommands: registerCommands
    };
} )();


function getNextOrPreviousLine( dir: direction ) : vscode.TextLine | undefined
{
    const editor = vscode.window.activeTextEditor;

    if ( editor )
    {
        let currLine = editor.selection.active.line;
        let isNext = dir === "NEXT";

        // dynamic for-loop that change direction based on 'isNext':
        // isNext === true => loop forward, else loop backward
        // kind of ugly but nice at the same time
        for ( let i = ( isNext ? currLine + 1 : currLine - 1 ); isNext ? i < editor.document.lineCount : i >= 0; isNext ? i++ : i-- )
        {
            let line = editor.document.lineAt( i );

            if ( !line.isEmptyOrWhitespace && /^[a-zA-Z]{2,}/.test( line.text.trim() ) )
            {
                return line;
            }
        }
    }

    return undefined;
}

function getNextOrPreviousError( dir: direction ) : vscode.Range | undefined
{
    let editor = vscode.window.activeTextEditor;

    let errorRanges: vscode.Range[] = vscode.languages.getDiagnostics()
        .filter( uriDiag => editor && uriDiag[0].path === editor.document.uri.path )[0][1]
        // [0] => get first of array => current file
        // [1] => get diagnostics ([0] is uri)
        .map( diag => diag.range );

    if ( editor && errorRanges.length )
    {

        let currentLinePos: vscode.Position = editor.selection.active;

        if ( dir === "NEXT" )
        {
            errorRanges = errorRanges.sort( ( d1, d2 ) => d1.start.isBefore( d2.start ) ? -1 : 1 );

            for ( let i = 0; i < errorRanges.length; i++ )
            {
                if ( errorRanges[i].start.isAfter( currentLinePos ) )
                {
                    return errorRanges[i];
                }
            }
        }
        if ( dir === "PREV" )
        {
            errorRanges = errorRanges.sort( ( d1, d2 ) => d1.start.isBefore( d2.start ) ? 1 : - 1 );

            for ( let i = 0; i < errorRanges.length; i++ )
            {
                if ( errorRanges[i].end.isBefore( currentLinePos ) )
                {
                    return errorRanges[i];
                }
            }
        }
    }

    return undefined;
}

function getCurrentLineWordIndexes() : { iWordStart: number, iWordEnd: number}[] {

    let editor = vscode.window.activeTextEditor;
    let currLineNum = editor.selection.active.line;
    let currentLine = vscode.window.activeTextEditor.document.lineAt( currLineNum );
    let s = currentLine.text.slice( currentLine.firstNonWhitespaceCharacterIndex );

    let indexes: { iWordStart: number, iWordEnd: number}[] = [];

    let letters = s.split( "" );

    let index = -1;
    let cpt = 0;
    for ( let i = 0; i < letters.length; i++ ) {
        let letter = letters[i];
        if ( /[a-zA-Z0-9$]/.test( letter ) ) {
            if ( index === -1 ) {
                index = i;
            }
            cpt++;
        } else {
            if ( cpt !== 0 ) {
                indexes.push( { iWordStart: index, iWordEnd: index + cpt } );
                index = -1;
                cpt = 0;
            }
        }
    }

    return indexes.map( e => ( {
        iWordStart: e.iWordStart + currentLine.firstNonWhitespaceCharacterIndex,
        iWordEnd: e.iWordEnd + currentLine.firstNonWhitespaceCharacterIndex } )
    );
}

function moveToStartOfTextLine( line: vscode.TextLine ) : void
{
    moveToLine( line.lineNumber, line.firstNonWhitespaceCharacterIndex );
}

function moveToPosition( startPos: vscode.Position, endPos?: vscode.Position ) : void
{
    moveToLine( startPos.line, startPos.character, endPos && endPos.line, endPos && endPos.character );
}

function moveToLine( lineRangeStart: number, cRangeStart: number, lineRangeEnd?: number, cRangeEnd?: number ) : void
{
    const editor = vscode.window.activeTextEditor;

    if ( editor )
    {
        editor.selection = new vscode.Selection(
            new vscode.Position( lineRangeStart, cRangeStart ),
            new vscode.Position( lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart )
        );

        // scroll when moving out of current range
        editor.revealRange( new vscode.Range(
            new vscode.Position( lineRangeStart, cRangeStart ),
            new vscode.Position( lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart )
        ) );
    }
}
