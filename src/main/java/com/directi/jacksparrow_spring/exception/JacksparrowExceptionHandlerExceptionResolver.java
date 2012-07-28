package com.directi.jacksparrow_spring.exception;

import org.springframework.core.Ordered;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.method.annotation.ExceptionHandlerMethodResolver;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.ArrayList;

/* https://github.com/rstoyanchev/spring-mvc-31-demo/ */

public class JacksparrowExceptionHandlerExceptionResolver
        extends ExceptionHandlerExceptionResolver {

    private Object handler;
    private ExceptionHandlerMethodResolver methodResolver;

    public JacksparrowExceptionHandlerExceptionResolver() {
        this.handler = new JacksparrowExceptionHandler();
        this.methodResolver =
                new ExceptionHandlerMethodResolver(handler.getClass());
        setOrder(Ordered.HIGHEST_PRECEDENCE);
        setMessageConverters(new ArrayList<HttpMessageConverter<?>>() {{
            add(new MappingJackson2HttpMessageConverter());
        }});
    }

    @Override
    protected ServletInvocableHandlerMethod getExceptionHandlerMethod(
            HandlerMethod handlerMethod, Exception exception) {
        ServletInvocableHandlerMethod result =
                super.getExceptionHandlerMethod(handlerMethod, exception);
        if (result != null) {
            return result;
        }
        Method method = this.methodResolver.resolveMethod(exception);
        return (method != null) ?
                new ServletInvocableHandlerMethod(this.handler, method) : null;
    }

    protected boolean shouldApplyTo(HttpServletRequest request,
                                    Object handler) {
        return request.getRequestURI().startsWith("/api/");
    }

}
