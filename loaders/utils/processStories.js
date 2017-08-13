'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const path = require('path');
const fs_1 = require('fs');
const requireIt = require('./requireIt');
const ts = require('typescript');

const source = "let x: string  = 'string'";
function processStories(filepath) {
	const storiesFile = path.join(
		path.dirname(filepath),
		path.basename(filepath, '.tsx') + '.story.tsx'
	);
	const sourceFile = ts.createSourceFile(
		storiesFile,
		fs_1.readFileSync(storiesFile).toString(),
		ts.ScriptTarget.ES2017,
		true
	);
	return {
		module: requireIt(storiesFile),
		source: processStoriesSource(sourceFile),
	};
}
function processStoriesSource(storiesFile) {
	let fnName;
	const result = [];
	processNode(storiesFile);
	function processNode(node) {
		if (ts.isExportAssignment(node)) {
			const expression = node.expression;
			if (ts.isArrowFunction(expression)) {
				fnName = expression.parameters[0].name.getText();
			}
		}
		if (ts.isCallExpression(node)) {
			if (node.expression.getText() === fnName) {
				const firstArgument = node.arguments[0];
				if (ts.isStringLiteral(node.arguments[0])) {
					const storyFn = node.arguments[1];
					if (ts.isArrowFunction(storyFn)) {
						const storyBody = storyFn.body.getText();
						result.push(storyBody);
					}
				}
			}
		}
		ts.forEachChild(node, processNode);
	}
	return result;
}
exports.default = processStories;
