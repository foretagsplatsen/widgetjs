define(['./widget',
        './inputs/controlWidget',
        './inputs/selectableControlWidget',
        './inputs/selectionWidget',
        './inputs/optionWidget',
        './inputs/optionGroupWidget',
        './inputs/selectWidget',
        './inputs/radioButtonWidget',
        './inputs/radioButtonListWidget',
        './inputs/checkboxWidget',
        './inputs/checkboxListWidget',
        './inputs/inputWidget'
    ],
    function(widget, controlWidget,selectableControlWidget, selectionWidget, optionWidget,
             optionGroupWidget, selectWidget, radioButtonWidget,
             radioButtonListWidget, checkboxWidget, checkboxListWidget, inputWidget) {


    //TODO: TESTS
    //TODO: PROPERTIES
    //TODO: documentation
    // TODO: Input

    return {
        option: optionWidget,
        select: selectWidget,
        optionGroup: optionGroupWidget,
        radioButtonList: radioButtonListWidget,
        radioButton: radioButtonWidget,
        checkbox: checkboxWidget,
        checkboxList: checkboxListWidget,
        input: inputWidget
    };
});