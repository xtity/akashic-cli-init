import { InitParameterObject } from "./InitParameterObject";
import { TemplateConfig } from "./TemplateConfig";
import * as commons from "@akashic/akashic-cli-commons";

/**
 * template.json の guideMessage 要素を出力する
 */
export function showTemplateMessage(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	return showTemplateGuideMessage(templateConfig, param);
}

function showTemplateGuideMessage(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	const guideMessage = templateConfig.guideMessage;
	if (!guideMessage) return Promise.resolve();
	return showMessage(guideMessage, param.logger);
}

function showMessage(message: string, logger: commons.Logger): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const texts = message.split("\n");
		texts.forEach((text: string) => {
			logger.print(text);
		});
		resolve();
	});
}
