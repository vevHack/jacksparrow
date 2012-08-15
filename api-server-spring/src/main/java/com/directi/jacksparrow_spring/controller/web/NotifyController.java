package com.directi.jacksparrow_spring.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@Controller
@RequestMapping("/socket")
public class NotifyController {

    public String createParams(String users[]) {
        String urlParameters = "";
        for (String user:users) {
            urlParameters += "users="+user+"&";
        }
        return urlParameters.trim().substring(0,urlParameters.length()-1);
    }


    @RequestMapping("/notify")
    @ResponseBody
    public void notifyClients() {
        // code to send this message to socket.io server
        try {
            String users[] = {"harsh","akshay"};
            URL url = new URL("http://localhost:8081/notify");
            HttpURLConnection connection = (HttpURLConnection)url.openConnection();
            connection.setRequestMethod("POST");

            connection.setDoOutput(true);
            OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());
            writer.write(createParams(users));
            writer.flush();
            writer.close();
            System.out.println(connection.getResponseCode());
            System.out.println(connection.getResponseMessage());


        } catch (Exception exception) {
            System.out.println(exception);
        }
    }

}
