import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";

export default class QuestValidator {
    validate() {
        app.quests.each((quest) => {
            quest.stage = undefined;
            quest.checks.forEach((check, index) => {
                if (this.check(check)) {
                    quest.stage = index;
                }
            });
        });
    }

    check(check) {
        check = check.replace(/ /g, '');

        if (!check || check.length === 0) {
            return true;
        }

        check = check.replace(/\d*'?[!=]=/gm, (value) => {
            const id = parseInt(value.replace(/\D/g, ''));
            const scenario = this.scenarioRepository.find(id);
            const operator = value.slice(-2);

            // check state
            if (!value.includes("'")) {
                return '"' + scenario.state + '"' + operator;
            }
            // check choice
            else {
                return scenario.choice + operator;
            }
        })
        check = check.replace(/=c/g, '="' + ScenarioState.complete + '"');

        return Function('"use strict";return (' + check + ')')();
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
}
