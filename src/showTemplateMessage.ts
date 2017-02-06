import * as fs from "fs-extra";
import * as path from "path";
import {InitParameterObject} from "./InitParameterObject";
import { TemplateConfig } from "./copyTemplate";
import * as commons from "@akashic/akashic-cli-commons";

/**
 * template.json の guideMessage 要素を出力する
 */
export function showTemplateMessage(param: InitParameterObject): Promise<void> {
	const copySpecPath = path.join(param.localTemplateDirectory, param.type, "template.json");
	return new Promise<void>((resolve, reject) => {
		fs.readJson(copySpecPath, (err: any, templateConfig: TemplateConfig) => {
			if (err) {
				if (err.code !== "ENOENT") {
					reject(err);
					return;
				}
				templateConfig = {};
			}
			showTemplateGuideMessage(templateConfig, param)
				.then(resolve, reject);
		});
	});
}

function showTemplateGuideMessage(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	const guideMessage = templateConfig.guideMessage;
	if (!guideMessage) return Promise.resolve();
	return showMessage(guideMessage, param.logger);
}

function showMessage(messages: string, logger: commons.Logger): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const texts = messages.split("\n");
		texts.forEach((text: string) => {
			logger.print(text);
		});
		resolve();
	});
}
