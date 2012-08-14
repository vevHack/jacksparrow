package com.directi.jacksparrow_spring;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
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


    public BufferedImage getSubImage(CommonsMultipartFile file,
                                     int x, int y, int width,
                                     int height, double ratio) {
        return getImageFromFile(file).
                getSubimage((int)(ratio*x), (int)(ratio*y),
                        (int)(ratio*width), (int)(ratio*height));
    }

    public byte[] getBytes (BufferedImage image) throws Exception{
        ByteArrayOutputStream opStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", opStream);
        opStream.flush();
        return opStream.toByteArray();
    }

   public BufferedImage resizeImage(int width, int height,
                                    BufferedImage originalImage) {
       int type = originalImage.getType()==0 ? BufferedImage.TYPE_INT_ARGB:
               originalImage.getType();
       BufferedImage image  = new BufferedImage(width, height, type);
       Graphics2D graphics = image.createGraphics();
       graphics.drawImage(originalImage, 0, 0, width, height, null);
       return image;
   }


}
