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
(function($) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-radiobutton__editdialog",
        RADIOBUTTON_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-radiobutton__customtext",
        RADIOBUTTON_ASSISTPRIORITY_VALUE = 'input[name="./assistPriority"]',
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Shows custom text box depending on the value of assist priority of radio button
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleValueChanged(dialog) {
        var component = $(RADIOBUTTON_ASSISTPRIORITY_VALUE);
        var customtext = dialog.find(RADIOBUTTON_CUSTOMTEXT);
        var hideAndShowElements = function() {
            if(component[0].value === "custom"){
                customtext.show();
            } else {
                customtext.hide();
            }
        };
        hideAndShowElements();
        dialog.on("change", component, function() {
            hideAndShowElements();
        });
    }
    Utils.initializeEditDialog(EDIT_DIALOG)(handleValueChanged);

})(jQuery);
