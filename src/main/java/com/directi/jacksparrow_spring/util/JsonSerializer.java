package com.directi.jacksparrow_spring.util;

import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.server.ServletServerHttpResponse;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/*XXX Not Needed? */
public class JsonSerializer {

    public void write(HttpServletResponse response, Object object)
            throws IOException {
        MappingJackson2HttpMessageConverter jsonConverter =
                new MappingJackson2HttpMessageConverter();
        try {
            jsonConverter.write(object, null,
                    new ServletServerHttpResponse(response));
        } catch (HttpMessageNotWritableException ex) {
            throw new RuntimeException(ex);
        }
    }

}
