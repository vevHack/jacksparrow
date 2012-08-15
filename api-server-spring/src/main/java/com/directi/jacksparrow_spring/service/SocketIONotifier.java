package com.directi.jacksparrow_spring.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

@Service
public class SocketIONotifier {

    private String createParams(String type, List<String> tokens) {
        String urlParameters = "type=" + type;
        for (String token: tokens) {
            urlParameters += "&" + "token="+token;
        }
        return urlParameters;
    }

    public void notifyClients(String notificationType, List<String> accessTokens) {
        if (accessTokens.isEmpty()) {
            return;
        }

        String params = createParams(notificationType, accessTokens);
        try {
            URL url = new URL("http://127.0.0.1:8101/?" + params);
            HttpURLConnection yc = (HttpURLConnection)url.openConnection();
            yc.setRequestMethod("GET");
            yc.connect();
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(
                            yc.getInputStream()));
            String inputLine;

            while ((inputLine = in.readLine()) != null)
                System.out.println(inputLine);
            in.close();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

}
