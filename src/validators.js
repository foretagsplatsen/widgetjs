define([], function() {

    var _ = function(str, object) {
        return str;
    };

    function required() {
        return function(value) {
            if (!value) {
                throw _('Field is required');
            }
        };
    }

    function notBlank() {
        return function(value) {
            if (!value || '' === value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
                throw _('Can not be blank');
            }
        };
    }

    function maxLength(max) {
        return function(value) {
            if (value && value.length > max) {
                throw _('Must be less than {maxLength}', { maxLength: max });
            }
        };
    }

    function minLength(min) {
        return function(value) {
            if (value && value.length < min) {
                throw _('Must be at least {minLength} characters', { minLength: min });
            }
        };
    }

    function exactLength(length) {
        return function(value) {
            if (value && value.length !== length) {
                throw _('Must be exactly {length} characters long', { length: length });
            }
        };
    }

    function lengthBetween(min, max) {
        return function(value) {
            if (value && (value.length < min || value.length < max)) {
                throw _('Must be between {min} and {max} characters long', { min: min, max: max });
            }
        };
    }

    function alphanum() {
        return function(value) {
            if (value && !(/^\w+$/.test(value))) {
                throw _('Must be alphanumeric, letters (a-z) and digits (0-9) allowed.');
            }
        };
    }

    function lowerCase() {
        return function(letters) {
            if (typeof letters !== 'string') {
                return;
            }

            for (var i = 0; i < letters.length; i++) {
                if (letters[i] === letters[i].toUpperCase() &&
                    letters[i] !== letters[i].toLowerCase()) {
                    throw _('Must be lower case');
                }
            }
        };
    }

    function firstLowerCaseLetter() {
        return function(letters) {
            if (typeof letters !== 'string') {
                return;
            }

            if (!/^[a-z]+/.test(letters)) {
                throw _('Must start with a lower case letter (a-z).');
            }
        };
    }

    function validNumber() {
        return function(value) {
            if (value && !(/^(\-)?([0-9])+$/.test(value))) {
                throw _('Must be a number');
            }
        };
    }

    function validInteger() {
        return function(value) {
            if (value && !(/^(\-)?(([1-9])([0-9])+|0)$/.test(value))) {
                throw _('Must be a number without decimals');
            }
        };
    }

    function maxValue(max) {
        return function(value) {
            if (value && Number(value) > max) {
                throw _('Must be number less than {max}', {max: max});
            }
        };
    }

    function minValue(min) {
        return function(value) {
            if (value && Number(value) < min) {
                throw _('Must be number greater than {min}', {min: min});
            }
        };
    }

    function valueInRange(min, max) {
        return function(value) {
            if (value && (Number(value) < min || Number(value) > max)) {
                throw _('Must be number between {min} and {max}', {min: min, max: max});
            }
        };
    }

    function validEmail() {
        return function(value) {
            if (value && !(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(value))) {
                throw _('Must be a valid email');
            }
        };
    }

    function validUrl() {
        return function(value) {
            if (value && !(/^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/.test(value))) {
                throw _('Must be a valid URL');
            }
        };
    }

    function validStrictUrl() {
        return function(value) {
            if (value && !(/^(https?:\/\/)+([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/.test(value))) {
                throw _('Must be a valid URL starting with http:// or https://');
            }
        };
    }

    function isoDateString() {
        return function(value) {
            if (value && !(/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/.test(value))) {
                throw _('Must be a valid date (YYYY-MM-DD)');
            }
        };
    }

    function matchRegExp(expression, message) {
        return function(value) {
            if (!(value && expression.test(value))) {
                throw _(message);
            }
        };
    }

    function validateAll() {
        var validators = Array.prototype.slice.call(arguments);
        return function(value) {
            validators.forEach(function(validator) {
                validator(value);
            });
        };
    }

    return {
        required:             required,
        notBlank:             notBlank,
        maxLength:            maxLength,
        minLength:            minLength,
        exactLength:          exactLength,
        lengthBetween:        lengthBetween,
        alphanum:             alphanum,
        lowerCase:            lowerCase,
        firstLowerCaseLetter: firstLowerCaseLetter,
        validNumber:          validNumber,
        validInteger:         validInteger,
        maxValue:             maxValue,
        minValue:             minValue,
        valueInRange:         valueInRange,
        validEmail:           validEmail,
        validUrl:             validUrl,
        validStrictUrl:       validStrictUrl,
        isoDateString:        isoDateString,
        matchRegExp:          matchRegExp,
        validateAll:          validateAll
    };
});