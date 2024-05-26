// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mantineCmd" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mantineCmd.createCss', () => {
        // Get the active text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        // Create a new file with the same name as the current file but with a .css extension
        let currentFile = editor.document.fileName;
        let cssFile = currentFile.replace('.tsx', '.module.css');
        vscode.workspace.fs.writeFile(vscode.Uri.file(cssFile), new Uint8Array(0));

        const importStr = `import classes from './${cssFile.split('/').pop()}';\n`;

        // Check if the current file already has a css file imported
        let text = editor.document.getText();
        if (!text.includes(importStr)) {
            // Import the new css file
            editor.edit((editBuilder) => {
                editBuilder.insert(new vscode.Position(0, 0), importStr);
            });
        }

        // Get the value of your setting
        vscode.workspace.getConfiguration('mantineCmd').get('mantineCmd.openCssFile');

        // Open the new css file to the right of the current file
        vscode.window.showTextDocument(vscode.Uri.file(cssFile), {
            preview: false,
            viewColumn: vscode.ViewColumn.Beside,
        });
    });

    context.subscriptions.push(disposable);

    let switchCommand = vscode.commands.registerCommand('mantineCmd.switch', () => {
        // Toggle between the TSX and CSS file
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        let currentFile = editor.document.fileName;
        let fileToOpen = currentFile.endsWith('.tsx')
            ? currentFile.replace('.tsx', '.module.css')
            : currentFile.replace('.module.css', '.tsx');

        const openEditor = vscode.window.visibleTextEditors.find(
            (editor) => editor.document.fileName === fileToOpen
        );

        vscode.window.showTextDocument(vscode.Uri.file(fileToOpen), {
            preview: false,
            viewColumn: openEditor ? openEditor.viewColumn : vscode.ViewColumn.Active,
        });
    });

    context.subscriptions.push(switchCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
