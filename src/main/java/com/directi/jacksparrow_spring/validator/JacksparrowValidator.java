package com.directi.jacksparrow_spring.validator;

import com.directi.jacksparrow_spring.exception.ValidationException;
import org.apache.commons.validator.EmailValidator;
import org.apache.commons.validator.GenericValidator;
import org.springframework.stereotype.Service;

@Service
public class JacksparrowValidator {

    private GenericValidator genericValidator = new GenericValidator();
    private EmailValidator emailValidator = EmailValidator.getInstance();

    public String validateUsername(String input)
            throws ValidationException {
        String error = doValidateUsername(input);
        if (error != null) {
            throw new ValidationException("Username " + error);
        }
        return input;
    }

    private String doValidateUsername(String input) {
        final String[] invalidCharacters = {"/", "\\"};
        final String[] invalidUsernames = {"api", "admin", "god"};

        if (genericValidator.isBlankOrNull(input))
            return "cannot be blank";

        for (String c: invalidCharacters) {
            if (input.contains(c)) {
                return "cannot contain " + c;
            }
        }

        for (String u: invalidUsernames) {
            if (input.equals(u)) {
                return "cannot be " + u;
            }
        }

        return null;
    }

    public String validateEmail(String input)
            throws ValidationException {
        if (!emailValidator.isValid(input)) {
            throw new ValidationException("Invalid email address");
        }
        return input;
    }

    public String validatePassword(String input)
            throws ValidationException {
        if (genericValidator.isBlankOrNull(input)) {
            throw new ValidationException("Password cannot be blank");
        }
        return input;
    }

}
