package com.directi.jacksparrow_spring.controller.web;

import com.directi.jacksparrow_spring.ImageResizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.awt.image.BufferedImage;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/imageupload")
public class ImageController {

    private @Autowired JdbcTemplate jdbcTemplate;

    ImageResizer imageResizer = new ImageResizer();

    @RequestMapping("/display")
    @ResponseBody
    public ModelAndView getPage() {
        return new ModelAndView("image");
    }

    @RequestMapping(value="/insert", method = RequestMethod.POST)
    @ResponseBody
    protected Map onSubmit(
            @RequestParam final CommonsMultipartFile uploadedFile,
            @RequestParam int user,@RequestParam double x,@RequestParam double y,
            @RequestParam double width,@RequestParam double height,
            @RequestParam double boundx,@RequestParam double boundy
            ) {


        if(uploadedFile!=null){
            try {
                BufferedImage image = imageResizer.
                        getImageFromFile(uploadedFile);

                double ratio = image.getHeight()/boundy;


                BufferedImage resizedImage  =
                        imageResizer.resizeImage(uploadedFile
                                , (int)(x*ratio), (int)(y*ratio),
                                (int)(width*ratio), (int)(height*ratio));
                byte[] imgBytes = imageResizer.getBytes(resizedImage);

                jdbcTemplate.update("INSERT INTO profile_pics(" +
                        "\"user\", original_image, shortened_image) VALUES(?, ?, ?)"
                        ,user , uploadedFile.getBytes(), imgBytes);

            } catch (Exception ex) {
                System.out.println("Error :"+ex);
            }
        }

        System.out.println("Length of uploaded file :"+ uploadedFile.getSize());

       return new HashMap() {{
           put ("status", "success");
        }};
        }

    @RequestMapping("/getImage")
    @ResponseBody

    public HttpEntity<byte[]> getImage(@RequestParam int user, @RequestParam int size) {

        String typeOfImage = "";
        typeOfImage = (size == 48) ? "shortened_image":"original_image";

        final String finalTypeOfImage = typeOfImage;

        Map result = (HashMap)jdbcTemplate.queryForObject(
                "SELECT shortened_image FROM profile_pics" +
                        " WHERE \"user\"=?", new RowMapper<Object>() {
            @Override
            public Object mapRow(final ResultSet resultSet, int i)
                    throws SQLException {
                final HashMap map = new HashMap();
                return new HashMap(){{
                    put("original",resultSet.getBytes("shortened_image"));
                }};
            }
        }, user);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        headers.setContentLength(
                ((byte[])result.get("original")).length);
        return new HttpEntity<byte[]>(
                (byte[])result.get("original"),headers);
    }
}
