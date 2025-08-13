import * as vscode from "vscode";
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "pro-code-cleaner.cleanCode",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showInformationMessage(
          "No active editor! Please open a file to clean."
        );
        return;
      }
      const documentText = editor.document.getText();
      const consoleLogRegex = /console\.(log|warn|error|info|debug)\(.*?\);?/g;
      let cleanedText = documentText.replace(consoleLogRegex, "");
      const multipleEmptyLinesRegex = /^\s*[\r\n]{2,}/gm;
      cleanedText = cleanedText.replace(multipleEmptyLinesRegex, "\n\n");
      const firstLine = editor.document.lineAt(0);
      const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
      const fullRange = new vscode.Range(
        firstLine.range.start,
        lastLine.range.end
      );
      editor
        .edit((editBuilder) => {
          editBuilder.replace(fullRange, cleanedText);
        })
        .then((success) => {
          if (success) {
            vscode.window.showInformationMessage(
              "Code has been cleaned successfully!"
            );
          }
        });
    }
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
