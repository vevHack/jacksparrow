package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.ImageManipulator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

import java.awt.image.BufferedImage;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/userpix")
public class ImageController {
    private Log log = LogFactory.getLog(this.getClass());

    private @Autowired JdbcTemplate jdbcTemplate;
    private @Autowired ImageManipulator imageManipulator;
    private @Autowired UserRepository userRepository;

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    protected void set(
            @RequestParam final CommonsMultipartFile file,
            @RequestParam int user,
            @RequestParam double x, @RequestParam double y,
            @RequestParam double width, @RequestParam double height,
            @RequestParam double boundx, @RequestParam double boundy)
            throws EntityNotFoundException {

        BufferedImage image = imageManipulator.getImageFromFile(file);

        double ratio = image.getHeight()/boundy;
        BufferedImage resizedImage  = imageManipulator.getSubImage(
                file, (int)x, (int)y, (int)width, (int)height, ratio);

        BufferedImage i128 =
                imageManipulator.resizeImage(128, 128, resizedImage);
        BufferedImage i48 =
                imageManipulator.resizeImage(48, 48, resizedImage);

        log.info("Actual dimension of crop : " + resizedImage.getHeight());
        log.info("After resizing dimensions :"+
                i128.getHeight()+" "+ i128.getWidth());

        jdbcTemplate.update("UPDATE userpix SET i128=?, i48=? WHERE " +
                "\"user\"=?",
                imageManipulator.getBytes(i128),
                imageManipulator.getBytes(i48),
                userRepository.findById(user).getId());
    }

    private HttpHeaders getImageHeaders(Map result) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        headers.setContentLength(
                ((byte[])result.get("original")).length);
        return headers;
    }

    @RequestMapping()
    @ResponseBody
    public HttpEntity<byte[]> get(
            @RequestParam int user, @RequestParam int size)
            throws PreconditionViolatedException, EntityNotFoundException {

        String query;
        if (size == 128) {
            query = "SELECT i128 FROM userpix WHERE \"user\"=?";
        } else if (size == 48) {
            query = "SELECT i48 FROM userpix WHERE \"user\"=?";
        } else {
            throw new PreconditionViolatedException("Invalid image size");
        }

        final String typeOfImage = "i" + String.valueOf(size);
        Map result = (HashMap)jdbcTemplate.queryForObject(query,
                new RowMapper<Object>() {
            @Override
            public Object mapRow(final ResultSet resultSet, int i)
                    throws SQLException {
                return new HashMap() {{
                    put("original", resultSet.getBytes(typeOfImage));
                }};
            }}, userRepository.findById(user).getId());

        return new HttpEntity<byte[]>(
                (byte[])result.get("original"), getImageHeaders(result));
    }

}