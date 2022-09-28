/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe("Form Runtime with Text Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/textinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-textinput'
    const IS = "adaptiveFormTextInput"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should('have.value', value)
        })
    }

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it(" model's changes are reflected in the html ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        model.value = "some other value"
        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState())
        })
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const input = "value"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
    });

    it ("help icon ('?') click should make description visible", () => {
        const [id] = Object.entries(formContainer._fields).filter(([id, field]) => {
            return field.widget.name === 'description_test';
        })[0];
        // Long description should be hidden initially
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__longdescription").invoke('attr', 'data-cmp-visible')
            .should('eq', 'false');
        // Click on ? icon
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__questionmark").click();
        // Long description should be visible now
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__longdescription").invoke('attr', 'data-cmp-visible')
            .should('not.exist');
    });

    it ("tooltip should be displayed if tooltipVisible", () => {
        const [id] = Object.entries(formContainer._fields).filter(([id, field]) => {
            return field.widget.name === 'description_test';
        })[0];
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__shortdescription").invoke('attr', 'data-cmp-visible')
        .should('not.exist');
    })

    it ("If tooltipVisible and ? clicked, then short description should be hidden", () => {
        const [id] = Object.entries(formContainer._fields).filter(([id, field]) => {
            return field.widget.name === 'description_test';
        })[0];
        // click ? icon
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__questionmark").click();
        // long description should be shown
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__longdescription").invoke('attr', 'data-cmp-visible')
            .should('not.exist');
        // short description should be hidden.
        cy.get(`#${id}`).find(".cmp-adaptiveform-textinput__shortdescription").invoke('attr', 'data-cmp-visible')
            .should('eq', 'false');
    })
})