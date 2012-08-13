package com.directi.jacksparrow_spring;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ImageResizer {

    public BufferedImage getImageFromFile(CommonsMultipartFile file) {
        try {
            return ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        } catch(IOException exception) {

        }
        return null;
    }


    public BufferedImage resizeImage(CommonsMultipartFile file,
                                     int x, int y, int width, int height) {
        BufferedImage resizedImage = getImageFromFile(file).
                getSubimage(x, y, width, height);
        return resizedImage;
    }

    public byte[] getBytes (BufferedImage image) throws Exception{
        ByteArrayOutputStream opStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", opStream);
        opStream.flush();
        return opStream.toByteArray();
    }
}
