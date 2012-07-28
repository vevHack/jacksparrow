package com.directi.jacksparrow_spring.exception;

import org.springframework.beans.ConversionNotSupportedException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import java.util.HashMap;
import java.util.Map;

public class JacksparrowExceptionHandler {

	@ExceptionHandler(value=Exception.class)
	public ResponseEntity<Map<String, Object>> handle(final Exception ex) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

        HttpStatus status = null;
        if (ex instanceof JacksparrowException) {
            status = ((JacksparrowException)ex).getHttpStatus();
        } else {
            status = getStatusForDefaultException(ex);
        }

        final Integer code = status.value();
        Map<String, Object> content = new HashMap<String, Object>() {{
            put("error", new HashMap<String, Object>() {{
                put("code", code);
                put("message", ex.getMessage());
            }});
        }};

        return new ResponseEntity<Map<String, Object>>(
                content, headers, status);
	}

    /* intent: duplicate the behaviour of DefaultHandlerExceptionResolver */
    private HttpStatus getStatusForDefaultException(Exception ex) {
        if (ex instanceof NoSuchRequestHandlingMethodException) {
            return HttpStatus.NOT_FOUND;
        }
        else if (ex instanceof HttpRequestMethodNotSupportedException) {
            return HttpStatus.METHOD_NOT_ALLOWED;
        }
        else if (ex instanceof HttpMediaTypeNotSupportedException) {
            return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
        }
        else if (ex instanceof HttpMediaTypeNotAcceptableException) {
            return HttpStatus.NOT_ACCEPTABLE;
        }
        else if (ex instanceof MissingServletRequestParameterException) {
            return HttpStatus.BAD_REQUEST;
        }
        else if (ex instanceof ServletRequestBindingException) {
            return HttpStatus.BAD_REQUEST;
        }
        else if (ex instanceof ConversionNotSupportedException) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        else if (ex instanceof TypeMismatchException) {
            return HttpStatus.BAD_REQUEST;
        }
        else if (ex instanceof HttpMessageNotReadableException) {
            return HttpStatus.BAD_REQUEST;
        }
        else if (ex instanceof HttpMessageNotWritableException) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        else if (ex instanceof MethodArgumentNotValidException) {
            return HttpStatus.BAD_REQUEST;
        }
        else if (ex instanceof MissingServletRequestPartException) {
            return HttpStatus.BAD_REQUEST;
        }
        else if (ex instanceof BindException) {
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.BAD_REQUEST;
    }

}