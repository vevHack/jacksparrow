package com.directi.jacksparrow_spring.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

@Component
public class JacksonConfig implements BeanPostProcessor {

    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    public Object postProcessAfterInitialization(Object bean, String beanName)
            throws BeansException {
        if (bean instanceof MappingJackson2HttpMessageConverter) {
            MappingJackson2HttpMessageConverter jsonConverter =
                    (MappingJackson2HttpMessageConverter) bean;
            ObjectMapper objectMapper = jsonConverter.getObjectMapper();
            configureObjectMapper(objectMapper);
            jsonConverter.setObjectMapper(objectMapper);
        }
        return bean;
    }

    private void configureObjectMapper(ObjectMapper objectMapper) {
        objectMapper.configure(
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.setPropertyNamingStrategy(
                PropertyNamingStrategy.CAMEL_CASE_TO_LOWER_CASE_WITH_UNDERSCORES);
    }
}
