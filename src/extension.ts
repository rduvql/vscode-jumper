import * as vscode from 'vscode';

// vscode.window.showInformationMessage('Hello World!');

export function activate(context: vscode.ExtensionContext)
{
    let disposable_previous = vscode.commands.registerCommand("ext.jumper.previous", () => {
        let line = getNextOrPreviousLine(false);

        line && moveToLine(line);
    });
    context.subscriptions.push(disposable_previous);

	let disposable_next = vscode.commands.registerCommand("ext.jumper.next", () => {

        let line = getNextOrPreviousLine(true);

        line && moveToLine(line);
    });
	context.subscriptions.push(disposable_next);
}

export function deactivate() {}

function getNextOrPreviousLine(isNext: boolean): vscode.TextLine | undefined
{
    const editor = vscode.window.activeTextEditor;

    if(editor)
    {
        let currLine = editor.selection.active.line;

        // dynamic for-loop that change direction base on 'isNext':
        // isNext === true => loop forward else loop backward
        // kind of ugly but nice at the same time
        for (let i = (isNext ? currLine + 1 : currLine - 1); isNext ? i < editor.document.lineCount : i > 0; isNext ? i++ : i--)
        {
            let line = editor.document.lineAt(i);

            if(!line.isEmptyOrWhitespace && /^[a-zA-Z]{2,}/.test(line.text.trim())) {
                return line;
            }
        }
    }

    return undefined;
}

function moveToLine(nextline: vscode.TextLine): void
{
    const editor = vscode.window.activeTextEditor;

    if(editor)
    {
        editor.selection = new vscode.Selection(
            new vscode.Position(nextline.lineNumber, nextline.firstNonWhitespaceCharacterIndex),
            new vscode.Position(nextline.lineNumber, nextline.firstNonWhitespaceCharacterIndex)
        );

        // scroll when moving out of current range
        editor.revealRange(new vscode.Range(
            new vscode.Position(nextline.lineNumber, nextline.firstNonWhitespaceCharacterIndex),
            new vscode.Position(nextline.lineNumber, nextline.firstNonWhitespaceCharacterIndex)
        ));
    }
}
