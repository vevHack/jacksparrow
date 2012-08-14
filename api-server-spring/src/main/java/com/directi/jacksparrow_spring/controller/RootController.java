package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.repository.BaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.SpringVersion;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/")
public class RootController {

    private @Autowired BaseRepository baseRepository;

    @RequestMapping("/**")
    public void captureApiUrls(HttpServletRequest request)
        throws NoSuchRequestHandlingMethodException {
        throw new NoSuchRequestHandlingMethodException(request);
    }

    @RequestMapping("/ping")
    @ResponseBody
    public Map<String, Object> sayHi(final HttpServletRequest request) {
        return new HashMap<String, Object>() {{
            put("message", "Namaste!");
            put("timestamp", baseRepository.getCurrentTimestamp());
            put("version", new HashMap<String, Object>() {{
                put("spring", getSpringVersion());
                put("database", baseRepository.getVersion());
                put("server", getServerVersion(request));
            }});
        }};
    }

    private String getServerVersion(HttpServletRequest request) {
        return request.getServletContext().getServerInfo();
    }

    private String getSpringVersion() {
        return new SpringVersion().getVersion();
    }

}
