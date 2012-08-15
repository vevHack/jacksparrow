package com.directi.jacksparrow_spring.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ImageManipulator {

    public BufferedImage getImageFromFile(CommonsMultipartFile file) {
        try {
            return ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        } catch(IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public BufferedImage getSubImage(
            CommonsMultipartFile file,
            int x, int y, int width, int height, double ratio) {
        return getImageFromFile(file).
                getSubimage((int)(ratio*x), (int)(ratio*y),
                        (int)(ratio*width), (int)(ratio*height));
    }

    public byte[] getBytes (BufferedImage image) {
        ByteArrayOutputStream opStream = new ByteArrayOutputStream();
        try {
            ImageIO.write(image, "png", opStream);
            opStream.flush();
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
        return opStream.toByteArray();
    }

   public BufferedImage resizeImage(
           int width, int height, BufferedImage originalImage) {

       int type = originalImage.getType() == 0 ?
               BufferedImage.TYPE_INT_ARGB : originalImage.getType();
       BufferedImage resizedImage = new BufferedImage(width, height, type);
       Graphics2D g = resizedImage.createGraphics();
       g.drawImage(originalImage, 0, 0, width, height, null);
       g.dispose();
       g.setComposite(AlphaComposite.Src);

       g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
               RenderingHints.VALUE_INTERPOLATION_BILINEAR);
       g.setRenderingHint(RenderingHints.KEY_RENDERING,
               RenderingHints.VALUE_RENDER_QUALITY);
       g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
               RenderingHints.VALUE_ANTIALIAS_ON);

       return resizedImage;
   }

}
