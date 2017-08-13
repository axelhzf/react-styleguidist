"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var requireIt = require("./requireIt");
var ts = require("typescript");
var source = "let x: string  = 'string'";
function processStories(filepath) {
    var storiesFile = path.join(path.dirname(filepath), path.basename(filepath, '.tsx') + '.story.tsx');
    var sourceFile = ts.createSourceFile(storiesFile, fs_1.readFileSync(storiesFile).toString(), ts.ScriptTarget.ES2017, true);
    return {
        module: requireIt(storiesFile),
        source: processStoriesSource(sourceFile)
    };
}
function processStoriesSource(storiesFile) {
    var fnName;
    var result = [];
    processNode(storiesFile);
    function processNode(node) {
        if (ts.isExportAssignment(node)) {
            var expression = node.expression;
            if (ts.isArrowFunction(expression)) {
                fnName = expression.parameters[0].name.getText();
            }
        }
        if (ts.isCallExpression(node)) {
            if (node.expression.getText() === fnName) {
                var firstArgument = node.arguments[0];
                if (ts.isStringLiteral(node.arguments[0])) {
                    var storyFn = node.arguments[1];
                    if (ts.isArrowFunction(storyFn)) {
                        var body = storyFn.body;
                        if (ts.isParenthesizedExpression(body)) {
                            result.push(body.expression.getText());
                        }
                        else {
                            var storyBody = body.getText();
                            result.push(storyBody);
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, processNode);
    }
    return result;
}
exports.default = processStories;
