package com.directi.jacksparrow_spring.config;

import com.directi.jacksparrow_spring.exception.ApiExceptionHandlerExceptionResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

@Configuration
@EnableWebMvc
public class ApiExceptionConfig extends WebMvcConfigurerAdapter {
    @Override
    public void configureHandlerExceptionResolvers(
            List<HandlerExceptionResolver> exceptionResolvers) {
        ApiExceptionHandlerExceptionResolver customResolver =
                new ApiExceptionHandlerExceptionResolver();
        customResolver.afterPropertiesSet();

        exceptionResolvers.add(customResolver);
    }
}
