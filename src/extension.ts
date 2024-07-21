import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let terminal: vscode.Terminal;

    const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = 'ffp-runner.runFfpFile';
    myStatusBarItem.text = "$(play) Run FFP";
    myStatusBarItem.tooltip = "Run FFP File";

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    context.subscriptions.push(myStatusBarItem);

    function updateStatusBarItem(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'ffp') {
            myStatusBarItem.show();
        } else {
            myStatusBarItem.hide();
        }
    }

    updateStatusBarItem(); // Call when the extension is activated

    let disposable = vscode.commands.registerCommand('ffp-runner.runFfpFile', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No FFP file is open");
            return;
        }

        const filePath = editor.document.uri.fsPath;

        // Create or show the terminal
        if (!terminal) {
            terminal = vscode.window.createTerminal(`FFP Run`);
        }
        terminal.show(true); // Focus the terminal

        // Execute the command
        terminal.sendText(`ffp "${filePath}"`);
    });

    context.subscriptions.push(disposable);

    context.subscriptions.push(new vscode.Disposable(() => {
        terminal?.dispose();
    }));
}

export function deactivate() {}
