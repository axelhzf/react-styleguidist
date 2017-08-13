import * as path from 'path';
import { readFileSync } from 'fs';
import * as requireIt from './requireIt';
import * as ts from "typescript";

const source = "let x: string  = 'string'";

function processStories(filepath: string) {

	const storiesFile = path.join(
		path.dirname(filepath),
		path.basename(filepath, '.tsx') + '.story.tsx'
	);

	let sourceFile = ts.createSourceFile(storiesFile, readFileSync(storiesFile).toString(), ts.ScriptTarget.ES2017, true);

	return {
		module: requireIt(storiesFile),
		source: processStoriesSource(sourceFile)
	};
}

function processStoriesSource(storiesFile: ts.SourceFile) {
	let fnName: string;
	const result = [];

	processNode(storiesFile);

	function processNode(node: ts.Node) {
			if (ts.isExportAssignment(node)) {
				const expression = node.expression;
				if (ts.isArrowFunction(expression)) {
					fnName = expression.parameters[0].name.getText();
				}
			}
			if(ts.isCallExpression(node)) {
				if (node.expression.getText() === fnName) {
					const firstArgument = node.arguments[0];
					if (ts.isStringLiteral(node.arguments[0])) {
						const storyFn = node.arguments[1];
						if (ts.isArrowFunction(storyFn)) {
							const body = storyFn.body;
							if(ts.isParenthesizedExpression(body)) {
								result.push(body.expression.getText());
							} else {
								const storyBody = body.getText();
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

export default processStories;
