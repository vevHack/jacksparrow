package com.directi.jacksparrow_spring.validator;

import com.directi.jacksparrow_spring.exception.ValidationException;
import org.apache.commons.validator.EmailValidator;
import org.apache.commons.validator.GenericValidator;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class JacksparrowValidator {

    private static final String[] invalidCharacters = {"@", "/", "\\"};
    private static final String[] invalidUsernames = {"api", "admin", "god"};
    private static final Pattern whiteSpaceRegex = Pattern.compile(".*\\s.*");
    private static final Pattern controlCharRegex =
            Pattern.compile(".*[\\u0000-\\u001f\\u007f-\\u009f].*");
    private static final int usernameLengthMax = 100;
    private static final int emailLengthMax = 100;

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

        if (genericValidator.isBlankOrNull(input))
            return "cannot be blank";

        for (String c: invalidCharacters) {
            if (input.contains(c)) {
                return "cannot contain " + c;
            }
        }

        if (whiteSpaceRegex.matcher(input).matches()) {
            return "cannot contain whitespace";
        }
        if (controlCharRegex.matcher(input).matches()) {
            return "cannot contain control character";
        }

        for (String u: invalidUsernames) {
            if (input.equals(u)) {
                return "cannot be " + u;
            }
        }

        if (input.length() > 100) {
            return "cannot exceed 100 characters";
        }

        return null;
    }

    public String validateEmail(String input)
            throws ValidationException {
        if (!emailValidator.isValid(input)) {
            throw new ValidationException("Invalid email address");
        }

        if (input.length() > 100) {
            throw new ValidationException("Email cannot exceed 100 characters");
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
