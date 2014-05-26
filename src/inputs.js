define(['./widget',
        './inputs/controlWidget',
        './inputs/selectableControlWidget',
        './inputs/selectionWidget',
        './inputs/optionWidget',
        './inputs/optionSetWidget',
        './inputs/optionGroupWidget',
        './inputs/selectWidget',
        './inputs/radioButtonWidget',
        './inputs/radioButtonListWidget',
        './inputs/checkboxWidget',
        './inputs/checkboxListWidget'
    ],
    function(widget, controlWidget,selectableControlWidget, selectionWidget, optionWidget,
             optionSetWidget, optionGroupWidget, selectWidget, radioButtonWidget,
             radioButtonListWidget, checkboxWidget, checkboxListWidget) {


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
        checkboxList: checkboxListWidget
    };
});